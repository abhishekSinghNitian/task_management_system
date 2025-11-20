import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const taskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    status: z.enum(['PENDING', 'COMPLETED']).optional(),
});

export const getTasks = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const { page = '1', limit = '10', status, search } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { userId };
    if (status) where.status = status;
    if (search) where.title = { contains: search as string };

    try {
        const tasks = await prisma.task.findMany({
            where,
            skip,
            take: limitNum,
            orderBy: { createdAt: 'desc' },
        });
        const total = await prisma.task.count({ where });

        res.json({ tasks, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

export const createTask = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    try {
        const { title, description } = taskSchema.parse(req.body);
        const task = await prisma.task.create({
            data: { title, description, userId: userId! },
        });
        res.status(201).json(task);
    } catch (error) {
        if (error instanceof z.ZodError) return res.status(400).json({ errors: error });
        res.status(500).json({ message: 'Error creating task' });
    }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    try {
        const { title, description, status } = taskSchema.partial().parse(req.body);

        const task = await prisma.task.findUnique({ where: { id } });
        if (!task || task.userId !== userId) return res.status(404).json({ message: 'Task not found' });

        const updatedTask = await prisma.task.update({
            where: { id },
            data: { title, description, status },
        });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task' });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    try {
        const task = await prisma.task.findUnique({ where: { id } });
        if (!task || task.userId !== userId) return res.status(404).json({ message: 'Task not found' });

        await prisma.task.delete({ where: { id } });
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
};

export const toggleTask = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    try {
        const task = await prisma.task.findUnique({ where: { id } });
        if (!task || task.userId !== userId) return res.status(404).json({ message: 'Task not found' });

        const updatedTask = await prisma.task.update({
            where: { id },
            data: { status: task.status === 'PENDING' ? 'COMPLETED' : 'PENDING' },
        });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error toggling task' });
    }
};
