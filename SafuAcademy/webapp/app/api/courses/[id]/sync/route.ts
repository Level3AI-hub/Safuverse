import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { RelayerService, ProgressService } from '@/lib/services';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';

const relayerService = new RelayerService(prisma);
const progressService = new ProgressService(prisma, relayerService);

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = verifyAuth(request);
        if (!auth) {
            return unauthorizedResponse();
        }

        const { id } = await params;
        const courseId = parseInt(id, 10);

        if (isNaN(courseId)) {
            return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
        }

        // Use progress service to check and sync course completion
        const result = await progressService.checkAndAwardCourseCompletion(auth.userId, courseId);

        return NextResponse.json({
            message: result.completed ? 'Course synced to blockchain' : 'Course not completed yet',
            completed: result.completed,
            txHash: result.txHash,
        });
    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json(
            { error: 'Failed to sync course' },
            { status: 500 }
        );
    }
}
