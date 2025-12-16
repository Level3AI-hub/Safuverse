import { PrismaClient } from '@prisma/client';
import { getPointsConfig } from '../points';

interface QuizQuestion {
    id?: string;
    question: string;
    options: string[];
    correctIndex: number;
}

export class QuizService {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async getQuizByLessonId(lessonId: string) {
        return this.prisma.quiz.findUnique({
            where: { lessonId },
        });
    }

    async getQuizWithLesson(lessonId: string) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { lessonId },
        });
        if (!quiz) return null;

        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            select: {
                id: true,
                title: true,
                courseId: true,
                course: {
                    select: {
                        level: true,
                    },
                },
            },
        });

        return { ...quiz, lesson };
    }

    async getQuizQuestions(lessonId: string): Promise<{
        quizId: string;
        lessonId: string;
        passingScore: number;
        questions: Array<{
            question: string;
            options: string[];
        }>;
    } | null> {
        const quiz = await this.getQuizByLessonId(lessonId);
        if (!quiz) return null;

        const questions = quiz.questions as unknown as QuizQuestion[];

        // Return questions WITHOUT correct answers
        return {
            quizId: quiz.id,
            lessonId: quiz.lessonId,
            passingScore: quiz.passingScore,
            questions: questions.map(q => ({
                question: q.question,
                options: q.options,
            })),
        };
    }

    async submitQuizAnswers(
        userId: string,
        lessonId: string,
        answers: number[] // array of selected option indices
    ): Promise<{
        success: boolean;
        scorePercent: number;
        passed: boolean;
        correctIndices: number[];
        pointsAwarded: number;
        error?: string;
    }> {
        const quizWithLesson = await this.getQuizWithLesson(lessonId);
        if (!quizWithLesson || !quizWithLesson.lesson) {
            return {
                success: false,
                scorePercent: 0,
                passed: false,
                correctIndices: [],
                pointsAwarded: 0,
                error: 'Quiz not found',
            };
        }

        // Check if user is enrolled
        const enrollment = await this.prisma.userCourse.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId: quizWithLesson.lesson.courseId,
                },
            },
        });

        if (!enrollment) {
            return {
                success: false,
                scorePercent: 0,
                passed: false,
                correctIndices: [],
                pointsAwarded: 0,
                error: 'User not enrolled in this course',
            };
        }

        const questions = quizWithLesson.questions as unknown as QuizQuestion[];
        let correctCount = 0;
        const correctIndices: number[] = [];

        // Grade the quiz
        for (let i = 0; i < questions.length; i++) {
            correctIndices.push(questions[i].correctIndex);
            if (answers[i] === questions[i].correctIndex) {
                correctCount++;
            }
        }

        const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
        const passed = scorePercent >= quizWithLesson.passingScore;

        // Count previous attempts to get attempt number
        const previousAttempts = await this.prisma.quizAttempt.count({
            where: {
                userId,
                quizId: quizWithLesson.id,
            },
        });

        // Record the attempt
        await this.prisma.quizAttempt.create({
            data: {
                userId,
                quizId: quizWithLesson.id,
                scorePercent,
                isPassed: passed,
                answers: answers,
                attemptNumber: previousAttempts + 1,
                passPointsAwarded: false, // Will be updated below if points are awarded
            },
        });

        // Award points only if passed and not already awarded for this quiz
        let pointsAwarded = 0;

        if (passed) {
            // Check if user already passed this quiz before
            const previousPass = await this.prisma.quizAttempt.findFirst({
                where: {
                    userId,
                    quizId: quizWithLesson.id,
                    isPassed: true,
                    id: { not: undefined }, // exclude the one we just created
                },
                orderBy: { createdAt: 'asc' },
            });

            // Only award points on first pass
            if (!previousPass) {
                // Award quiz points based on passPoints
                pointsAwarded = quizWithLesson.passPoints;

                // Award points to user
                await this.prisma.user.update({
                    where: { id: userId },
                    data: { totalPoints: { increment: pointsAwarded } },
                });
            }
        }

        return {
            success: true,
            scorePercent,
            passed,
            correctIndices,
            pointsAwarded,
        };
    }

    async getUserQuizAttempts(userId: string, lessonId: string) {
        const quiz = await this.getQuizByLessonId(lessonId);
        if (!quiz) return [];

        return this.prisma.quizAttempt.findMany({
            where: {
                userId,
                quizId: quiz.id,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async hasUserPassedQuiz(userId: string, lessonId: string): Promise<boolean> {
        const quiz = await this.getQuizByLessonId(lessonId);
        if (!quiz) return false;

        const passedAttempt = await this.prisma.quizAttempt.findFirst({
            where: {
                userId,
                quizId: quiz.id,
                isPassed: true,
            },
        });

        return !!passedAttempt;
    }
}
