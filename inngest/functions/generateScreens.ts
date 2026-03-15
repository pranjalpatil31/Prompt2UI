import { inngest } from "../client";
import { success, z } from "zod";
import { openrouter } from "@/lib/openrouter";
import { generateObject, stepCountIs, generateText } from "ai";
import type { FrameType } from "../../types/project";
import { ANALYSIS_PROMPT, GENERATION_SYSTEM_PROMPT } from "../../lib/prompt";
import prisma from "../../lib/prisma";
import { BASE_VARIABLES, THEME_LIST } from "../../lib/themes";
import { unsplashTool } from "../tool";

// const AnalysisSchema = z.object({
//     theme: z
//         .string()
//         .describe("The specific visual theme ID (e.g., 'midnight', 'ocean-breeze', 'neo-brutalism')."),
//     screens: z
//         .array(
//             z.object({
//                 id: z
//                     .string()
//                     .describe("Unique identifier for the screen (e.g., 'hone-dashboard', 'profile-settings', 'transaction-history'). Use kebab-case."),
//                 name: z
//                     .string()
//                     .describe("Short, descriptive name of the screen (e.g., 'Home Dashboard', 'Profile', 'Transaction History')"),
//                 purpose: z
//                     .string()
//                     .describe("One clear sentense explaining what this screen accomplishes for the user and its role in the app"),
//                 visualDescription: z
//                     .string()
//                     .describe("A dense, high-fidelity visual directive (like an image geneartion prompt). Describe the layout, specific data examples (e.g., 'Oct-Mar), component hierarchy, and physical attributes (e.g. 'Chunky cards, 'Floating header', 'Floating action button', 'Bottom navigation', Header with user avatar)."),
//             })
//         )
//         .min(1)
//         .max(4),
// })

const AnalysisSchema = z.object({
    theme: z
        .string()
        .describe(
            "The specific visual theme ID used for the UI design (e.g., 'midnight', 'ocean-breeze', 'neo-brutalism', 'glassmorphism', 'minimal-light'). The theme determines the color palette, typography mood, spacing style, shadows, and overall design personality of the interface."
        ),

    screens: z
        .array(
            z.object({
                id: z
                    .string()
                    .describe(
                        "Unique identifier for the screen written in kebab-case (e.g., 'home-dashboard', 'profile-settings', 'transaction-history', 'fitness-summary'). This must be concise, URL-friendly, and unique across the app."
                    ),

                name: z
                    .string()
                    .describe(
                        "Short, human-readable screen title that clearly represents the page (e.g., 'Home Dashboard', 'Profile Settings', 'Transaction History', 'Workout Summary'). Keep it clear and descriptive."
                    ),

                purpose: z
                    .string()
                    .describe(
                        "One clear sentence explaining what this screen helps the user accomplish and why it exists in the application. Focus on the user's goal or task."
                    ),

                visualDescription: z
                    .string()
                    .describe(
                        "A dense, high-fidelity visual design directive similar to an image-generation prompt. Describe the UI layout, hierarchy, and key components in detail. Include things like: headers, navigation style (bottom nav, tabs, sidebar), cards, charts, lists, buttons, icons, avatars, and floating elements. Provide example data where possible (e.g., '8,432 steps', '420 kcal', 'Sleep: 7h 20m', 'Transactions from Oct–Mar'). Also mention spacing, component grouping, and stylistic traits such as 'floating header', 'chunky cards', 'glass panels', 'soft shadows', 'rounded containers', or 'bottom navigation bar'."
                    ),
            })
        )
        .min(1)
        .max(4)
        .describe(
            "A list of UI screens required for the application. Generate between 1 and 4 key screens that represent the main user flow of the product. Each screen should be meaningfully different and represent a realistic part of the app experience."
        ),
});

// const ScreenSchema = z.object({
//   html: z
//     .string()
//     .describe(
//       "Complete raw HTML markup for the mobile app screen using Tailwind CSS. Must start with <div> and include the full layout of the screen. Do not include markdown, explanations, <html>, <head>, or <body> tags."
//     ),

//   title: z
//     .string()
//     .describe(
//       "Short title of the generated screen that represents its purpose (e.g., Home Dashboard, Profile Settings, Transaction History)."
//     ),

//   components: z
//     .array(z.string())
//     .describe(
//       "List of main UI components used in the screen (e.g., header, bottom navigation, cards, charts, list items, floating action button)."
//     ),
// });

export const generateScreens = inngest.createFunction(
    { id: "generate-ui-screens" },
    { event: "ui/generate.screens" },
    async ({ event, step, publish }) => {
        const {
            userId,
            projectId,
            prompt,
            frames,
            theme: existingTheme,
        } = event.data;
        const CHANNEL = `user:${userId}`;
        const isExistingGeneration = Array.isArray(frames) && frames.length > 0;

        await publish({
            channel: CHANNEL,
            topic: "generation.start",
            data: {
                status: "running",
                projectId: projectId,
            },
        });

        // Analyze or Plan
        const analysis = await step.run("analyze-and-plan-screens", async () => {

            await publish({
                channel: CHANNEL,
                topic: "analysis.start",
                data: {
                    status: "analyzing",
                    projectId: projectId,
                },
            });
            const contextHTML = isExistingGeneration
                ? frames.slice(0, 4).map((frame: FrameType) => frame.htmlContent).join("\n")
                : "";
            const analysisPrompt = isExistingGeneration
                ? `
                USER_REQUEST: ${prompt}
                SELECTED_THEME: ${existingTheme}
                CONTEXT_HTML: ${contextHTML}
                `.trim()
                : `
                USER_REQUEST: ${prompt}
                `.trim();
            
            const { object } = await generateObject({
                model: openrouter.chat("google/gemini-2.5-flash-lite"),
                // model: "google/gemini-3.1-pro-preview"
                schema: AnalysisSchema,
                system: ANALYSIS_PROMPT,
                prompt: analysisPrompt,
            });

            const themeToUse = isExistingGeneration ? existingTheme : object.theme;

            if (isExistingGeneration) {
                await prisma.project.update({
                    where: {
                        id: projectId,
                        userId: userId,
                    },
                    data: { theme: themeToUse },
                });
            }

            await publish({
                channel: CHANNEL,
                topic: "analysis.complete",
                data: {
                    status: "generating",
                    theme: themeToUse,
                    totalScreens: object.screens.length,
                    screens: object.screens,
                    projectId: projectId,
                },
            });

            return { ...object, themeToUse };
        });
        // Actual generation of each screens
        for (let i = 0; i < analysis.screens.length; i++) {
            const screenPlan = analysis.screens[i];
            const selectedTheme = THEME_LIST.find(
                (t) => t.id === analysis.themeToUse
            );

            //Combine the theme styles + base variable
            const fullThemeCSS = `
                ${BASE_VARIABLES}
                ${selectedTheme?.style || ""}`;

            await step.run(`generated-screen-${i}`, async () => {
                // const { object } = await generateObject({
                const result = await generateText({
                    model: openrouter.chat("google/gemini-2.5-flash-lite"),
                    // model: "google/gemini-3.1-pro-preview"
                    // schema: ScreenSchema,
                    system: GENERATION_SYSTEM_PROMPT,
                    tools: {
                        searchUnsplash: unsplashTool,
                    },
                    stopWhen: stepCountIs(5),
                    prompt: `
                    -Screen ${i + 1}/${analysis.screens.length}
                    -Screen ID: ${screenPlan.id}
                    -Screen Name: ${screenPlan.name}
                    -Screen Purpose: ${screenPlan.purpose}

                    VISUAL DESCRIPTION: ${screenPlan.visualDescription}
                    THEME STYLE (Use these for colors): ${fullThemeCSS}

                    CRITICAL REQUIREMENTS:

                    1. **Generate ONLY raw HTML markup for this mobile app screen using Tailwind CSS.**
                    -Use Tailwind classes for layout, spacing, typography, shadows, etc.
                    -Use theme CSS variables ONLY for color-related properties:
                        -bg-[var(--background)],
                        -text-[var(--foreground)],
                        -border-[var(--border)],
                        -ring-[var(--ring)]

                    2. **All content must be inside a single root <div> that controls the layout.**
                    -No overflow classes on the root.
                    -All scrollable content must be inside inner containers with hidden scrollbars:
                    [&::-webkit-scrollbar]:hidden scrollbar-none

                    3. **For absolute overlays (maps, bottom sheets, modals, etc.):**
                    Use: \`relative w-full h-screen\`on the top div of the overlay.

                    4. **For regular content screens:**
                     Use: \`w-full h-full min-h-screen\` on the top div.

                    5. **Do NOT use h-screen on inner content unless absolutely required.**
                    -Height must grow with content.
                    -Content must be fully visible inside an iframe.

                    6. **For z-index layering:**
                    -Ensure absolute elements do not block other content unnecessarily.

                    7. **Output raw HTML only.**
                    -Start directly with <div>
                    -Do NOT include markdown
                    -Do NOT include comments
                    -Do NOT include <html>, <head>, or <body>

                    8. **Hardcode styles only if a theme variable is not needed for that element.**

                    9. **Ensure iframe-friendly rendering:**
                    -All elements must contribute to the final scrollHeight so the parent iframe can correctly resize.

                    Generate the complete production-ready HTML for this screen now.
                    `.trim(),
                });
                let finalHtml = result.text ?? "";
                // let finalHtml = object.html ?? "";
                const match = finalHtml.match(/<div[\s\S]*<\/div>/);
                finalHtml = match ? match[0]: finalHtml;
                finalHtml = finalHtml.replace(/```/g, "");
                
                //create the frame
                const frame = await prisma.frame.create({
                    data: {
                        projectId,
                        title: screenPlan.name,
                        htmlContent: finalHtml,
                    },
                });

                await publish({
                    channel: CHANNEL,
                    topic: "frame.created",
                    data: {
                        frame: frame,
                        screenId: screenPlan.id,
                        projectId: projectId,
                    },
                });
                return { success:true, frame: frames};
            });
        }

        await publish({
            channel: CHANNEL,
            topic: "generation.complete",
            data: {
                status: "completed",
                projectId: projectId,
            },
        });
    },
);