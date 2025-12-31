import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LessonService, RelayerService, ProgressService } from '@/lib/services';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';

const relayerService = new RelayerService(prisma);
const lessonService = new LessonService(prisma, relayerService);

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = verifyAuth(request);
        if (!auth) {
            return unauthorizedResponse();
        }

        const { id: lessonId } = await params;

        const userLesson = await lessonService.startLesson(auth.userId, lessonId);

        return NextResponse.json({
            message: 'Lesson started',
            userLesson,
        });
    } catch (error) {
        console.error('Start lesson error:', error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 }
        );
    }
}
