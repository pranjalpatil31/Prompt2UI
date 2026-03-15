import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server";
import { generateProjectName } from "@/app/action/action";
import { inngest } from "../../../inngest/client";

export async function GET(request: Request) {
    try {
        const session = await getKindeServerSession();
        const user = await session.getUser();

        if (!user) throw new Error("Unauthorized");


        const projects = await prisma.project.findMany({
            where: {
                userId: user.id,
            },
            take: 10,
            orderBy: {
                createdAt: "desc",
            },
        });
        return NextResponse.json({
            success: true,
            data: projects,
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({
            error: "Failed to fetch projects",
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();
        const session = await getKindeServerSession();
        const user = await session.getUser();

        if (!user) throw new Error("Unauthorized");
        if (!prompt) throw new Error("Prompt is required");

        const userId = user.id

        const projectNaame = await generateProjectName(prompt);

        const project = await prisma.project.create({
            data: {
                userId,
                name: projectNaame,
            }
        });

        //Trigger the Inngest workflow to generate the UI based on the prompt
        try {
            await inngest.send({
                name: "ui/generate.screens",
                data: {
                    userId,
                    projectId: project.id,
                    prompt,
                },
            });
        } catch (error) {
            console.log(error);
        }


        return NextResponse.json({
            success: true,
            data: project,
        });
    } catch (error) {
        console.log("Error creating project:", error);
        return NextResponse.json({
            error: "Failed to create project",
        }, { status: 500 });

    }
} 
