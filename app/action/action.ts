"use server";

import { openrouter } from "@/lib/openrouter";
import { generateText } from "ai";

export async function generateProjectName(prompt: string) {
    try {
        const { text } = await generateText({
            model: openrouter.chat("google/gemini-2.5-flash-lite"),
            system: `
                You are an AI assistant that generates creative and catchy project names based on the given prompt. The project name should be unique, memorable, and relevant to the prompt provided. Please generate a single project name that encapsulates the essence of the prompt in a concise and appealing way.
                - Keep it under 5 words.
                - Avoid using generic terms like "Project" or "App".
                - Capitalize the first letter of each word in the project name.
                - Do not include any special characters or numbers in the project name.
                - Ensure the project name is easy to pronounce and spell.
            `,
            prompt: prompt,
        });
        return text?.trim() || "Untitled Project";
    } catch (error) {
        console.log("Error generating project name:", error);
        return "Untitled Project";
    }
}