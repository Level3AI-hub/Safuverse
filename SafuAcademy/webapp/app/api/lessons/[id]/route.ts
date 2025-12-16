import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LessonService, RelayerService, ProgressService } from '@/lib/services';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';

const relayerService = new RelayerService(prisma);
const progressService = new ProgressService(prisma, relayerService);
const lessonService = new LessonService(prisma, relayerService);

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = verifyAuth(request);
        if (!auth) {
            return unauthorizedResponse();
        }

        const { id: lessonId } = await params;

        const lesson = await lessonService.getLesson(lessonId);

        if (!lesson) {
            return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
        }

        // Check enrollment
        const enrollment = await prisma.userCourse.findUnique({
            where: {
                userId_courseId: {
                    userId: auth.userId,
                    courseId: lesson.courseId,
                },
            },
        });

        if (!enrollment) {
            return NextResponse.json({ error: 'Not enrolled in this course' }, { status: 403 });
        }

        const userProgress = await lessonService.getUserLessonProgress(auth.userId, lessonId);

        return NextResponse.json({ lesson, userProgress });
    } catch (error) {
        console.error('Lesson fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch lesson' },
            { status: 500 }
        );
    }
}
