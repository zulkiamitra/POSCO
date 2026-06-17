import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { isProvided, parseDate, parseNumber } from "../utils/parse";

export const listSessions = async (req: Request, res: Response) => {
  const posyanduId = req.query.posyanduId ? String(req.query.posyanduId) : undefined;
  const status = req.query.status ? String(req.query.status) : undefined;

  const sessions = await prisma.posyanduSession.findMany({
    where: { posyanduId, status },
    orderBy: { date: "desc" }
  });

  return res.json({ data: sessions });
};

export const getSession = async (req: Request, res: Response) => {
  const { id } = req.params;

  const session = await prisma.posyanduSession.findUnique({ where: { id } });
  if (!session) {
    return res.status(404).json({ message: "Session not found." });
  }

  return res.json({ session });
};

export const createSession = async (req: Request, res: Response) => {
  const { date, timeRange, attendanceCount, status, kaderName, posyanduId } = req.body ?? {};

  if (!date) {
    return res.status(400).json({ message: "date is required." });
  }

  const dateValue = parseDate(date);
  if (dateValue === undefined) {
    return res.status(400).json({ message: "Invalid date." });
  }

  const attendanceValue = parseNumber(attendanceCount);
  if (isProvided(attendanceCount) && attendanceValue === undefined) {
    return res.status(400).json({ message: "Invalid attendanceCount." });
  }

  const session = await prisma.posyanduSession.create({
    data: {
      date: dateValue,
      timeRange,
      attendanceCount: attendanceValue,
      status,
      kaderName,
      posyanduId
    }
  });

  return res.status(201).json({ session });
};

export const updateSession = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { date, timeRange, attendanceCount, status, kaderName, posyanduId } = req.body ?? {};

  const existing = await prisma.posyanduSession.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Session not found." });
  }

  const dateValue = parseDate(date);
  if (isProvided(date) && dateValue === undefined) {
    return res.status(400).json({ message: "Invalid date." });
  }

  const attendanceValue = parseNumber(attendanceCount);
  if (isProvided(attendanceCount) && attendanceValue === undefined) {
    return res.status(400).json({ message: "Invalid attendanceCount." });
  }

  const session = await prisma.posyanduSession.update({
    where: { id },
    data: {
      date: dateValue,
      timeRange,
      attendanceCount: attendanceValue,
      status,
      kaderName,
      posyanduId
    }
  });

  return res.json({ session });
};

export const deleteSession = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existing = await prisma.posyanduSession.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Session not found." });
  }

  await prisma.posyanduSession.delete({ where: { id } });
  return res.json({ message: "Session deleted." });
};
