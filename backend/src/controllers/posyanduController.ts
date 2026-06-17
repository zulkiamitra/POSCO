import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { isProvided, parseBoolean } from "../utils/parse";

export const listPosyandus = async (req: Request, res: Response) => {
  const activeValue = parseBoolean(req.query.active);
  if (isProvided(req.query.active) && activeValue === undefined) {
    return res.status(400).json({ message: "Invalid active." });
  }

  const posyandus = await prisma.posyandu.findMany({
    where: { active: activeValue },
    orderBy: { createdAt: "desc" }
  });

  return res.json({ data: posyandus });
};

export const getPosyandu = async (req: Request, res: Response) => {
  const { id } = req.params;

  const posyandu = await prisma.posyandu.findUnique({ where: { id } });
  if (!posyandu) {
    return res.status(404).json({ message: "Posyandu not found." });
  }

  return res.json({ posyandu });
};

export const createPosyandu = async (req: Request, res: Response) => {
  const { name, kecamatan, kelurahan, active, kaderName } = req.body ?? {};

  if (!name || !kecamatan || !kelurahan) {
    return res.status(400).json({ message: "name, kecamatan, and kelurahan are required." });
  }

  const activeValue = parseBoolean(active);
  if (isProvided(active) && activeValue === undefined) {
    return res.status(400).json({ message: "Invalid active." });
  }

  const posyandu = await prisma.posyandu.create({
    data: { name, kecamatan, kelurahan, active: activeValue, kaderName }
  });

  return res.status(201).json({ posyandu });
};

export const updatePosyandu = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, kecamatan, kelurahan, active, kaderName } = req.body ?? {};

  const existing = await prisma.posyandu.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Posyandu not found." });
  }

  const activeValue = parseBoolean(active);
  if (isProvided(active) && activeValue === undefined) {
    return res.status(400).json({ message: "Invalid active." });
  }

  const posyandu = await prisma.posyandu.update({
    where: { id },
    data: { name, kecamatan, kelurahan, active: activeValue, kaderName }
  });

  return res.json({ posyandu });
};

export const deletePosyandu = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existing = await prisma.posyandu.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Posyandu not found." });
  }

  await prisma.posyandu.delete({ where: { id } });
  return res.json({ message: "Posyandu deleted." });
};
