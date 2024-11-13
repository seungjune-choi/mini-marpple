import express, { Router } from 'express';

export const appRouter = Router();
appRouter.use(express.json());