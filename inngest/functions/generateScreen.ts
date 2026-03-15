import { inngest } from "../client";
import { z } from "zod";
import { openrouter } from "@/lib/openrouter";
import { generateObject } from "ai";
import type { FrameType } from "../../types/project";
import { ANALYSIS_PROMPT } from "../../lib/prompt";
import prisma from "../../lib/prisma";

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

export const generateScreen = inngest.createFunction(
    { id: "generate-ui-screens" },
    { event: "ui/generate.screens" },
    async ({ event, step }) => {
        const {
            userId,
            projectId,
            prompt,
            frames,
            theme: existingTheme,
        } = event.data;
        const isRegeneration = frames.length > 0;

        // Analyze or Plan
        const analysis = await step.run("analyze-and-plan-screens", async () => {
            const contextHTML = frames.slice(0,4).map((frame:FrameType) => frame.htmlContent).join("\n")
            const analysisPrompt = isRegeneration
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
                schema: AnalysisSchema,
                system: ANALYSIS_PROMPT,
                prompt: analysisPrompt,
            });

            const themeToUse = isRegeneration ? existingTheme : object.theme;

            if(!isRegeneration) {
                await prisma.project.update({
                    where: {
                        id: projectId,
                        userId: userId,
                    },
                    data: { theme: themeToUse },
                });
            }

            return {...object, themeToUse};
        });
        // Actual generation of each screens
        
    },
);