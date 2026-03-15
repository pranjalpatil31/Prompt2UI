import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { inngest } from "../../../../inngest/client";


export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getKindeServerSession();
        const user = await session.getUser();

        if (!user) throw new Error("Unauthorized");

        const project = await prisma.project.findFirst({
            where: {
                userId: user.id,
                id: id,
            },
            include: {
                frames: true,
            },
        });
        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(project);

    } catch (error) { 
        console.log(error);
        return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
    }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { prompt } = await request.json();
        const session = await getKindeServerSession();
        const user = await session.getUser();

        if (!user) throw new Error("Unauthorized");
        if (!prompt) throw new Error("Prompt is required");

        const userId = user.id;
        const project = await prisma.project.findFirst({
            where: {id, userId: user.id},
            include: {frames: true},
        });

        if(!project) throw new Error("Project Not Found");

        //Trigger the Inngest workflow to generate the UI based on the prompt
        try {
            await inngest.send({
                name: "ui/generate.screens",
                data: {
                    userId,
                    projectId: id,
                    prompt,
                    frames: project.frames,
                    theme: project.theme,
                },
            });
        } catch (error) {
            console.log(error);
        }

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.log("Error Occured:", error);
        return NextResponse.json({
            error: "Failed to generate frame",
        }, { status: 500 });

    }
} 

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { themeId } = await request.json();
        const session = await getKindeServerSession();
        const user = await session.getUser();

        if (!user) throw new Error("Unauthorized");
        if (!themeId) throw new Error("Theme is missing");

        const userId = user.id;
        const project = await prisma.project.update({
            where:{id, userId},
            data:{
                theme: themeId,
            },
        });

        return NextResponse.json({
            success: true,
            project,
        });
    } catch (error) {
        console.log("Error Occured:", error);
        return NextResponse.json({
            error: "Failed to update Project",
        }, { status: 500 });

    }
} 