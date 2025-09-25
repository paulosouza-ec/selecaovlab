import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export const getMarathons = async (req: AuthRequest, res: Response) => {
    const marathons = await prisma.marathon.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: 'desc' },
    });
    res.json(marathons);
};

export const createMarathon = async (req: AuthRequest, res: Response) => {
    const { name, movies, totalMinutes } = req.body;
    const marathon = await prisma.marathon.create({
        data: {
            name,
            movies,
            totalMinutes,
            userId: req.userId!,
        },
    });
    res.status(201).json(marathon);
};

export const deleteMarathon = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.marathon.delete({
            where: { id: id, userId: req.userId }, // Garante que o usuário só pode deletar a sua própria maratona
        });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ message: 'Marathon not found' });
    }
};