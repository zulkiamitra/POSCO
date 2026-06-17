import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { isProvided, parseDate, parseNumber } from "../utils/parse";

export const listChildren = async (req: Request, res: Response) => {
  const posyanduId = req.query.posyanduId ? String(req.query.posyanduId) : undefined;
  const orangtuaId = req.query.orangtuaId ? String(req.query.orangtuaId) : undefined;

  const children = await prisma.child.findMany({
    where: { posyanduId, orangtuaId },
    orderBy: { createdAt: "desc" }
  });

  return res.json({ data: children });
};

export const getChild = async (req: Request, res: Response) => {
  const { id } = req.params;

  const child = await prisma.child.findUnique({ where: { id } });
  if (!child) {
    return res.status(404).json({ message: "Child not found." });
  }

  return res.json({ child });
};

export const createChild = async (req: Request, res: Response) => {
  const {
    name,
    motherName,
    birthDate,
    gender,
    birthWeight,
    height,
    weight,
    nutritionStatus,
    stuntingStatus,
    immunization,
    checkupHistory,
    posyanduId,
    orangtuaId
  } = req.body ?? {};

  if (!name) {
    return res.status(400).json({ message: "name is required." });
  }

  const birthDateValue = parseDate(birthDate);
  if (isProvided(birthDate) && birthDateValue === undefined) {
    return res.status(400).json({ message: "Invalid birthDate." });
  }

  const birthWeightValue = parseNumber(birthWeight);
  if (isProvided(birthWeight) && birthWeightValue === undefined) {
    return res.status(400).json({ message: "Invalid birthWeight." });
  }

  const heightValue = parseNumber(height);
  if (isProvided(height) && heightValue === undefined) {
    return res.status(400).json({ message: "Invalid height." });
  }

  const weightValue = parseNumber(weight);
  if (isProvided(weight) && weightValue === undefined) {
    return res.status(400).json({ message: "Invalid weight." });
  }

  const child = await prisma.child.create({
    data: {
      name,
      motherName,
      birthDate: birthDateValue,
      gender,
      birthWeight: birthWeightValue,
      height: heightValue,
      weight: weightValue,
      nutritionStatus,
      stuntingStatus,
      immunization,
      checkupHistory,
      posyanduId,
      orangtuaId
    }
  });

  return res.status(201).json({ child });
};

export const updateChild = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    motherName,
    birthDate,
    gender,
    birthWeight,
    height,
    weight,
    nutritionStatus,
    stuntingStatus,
    immunization,
    checkupHistory,
    posyanduId,
    orangtuaId
  } = req.body ?? {};

  const existing = await prisma.child.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Child not found." });
  }

  const birthDateValue = parseDate(birthDate);
  if (isProvided(birthDate) && birthDateValue === undefined) {
    return res.status(400).json({ message: "Invalid birthDate." });
  }

  const birthWeightValue = parseNumber(birthWeight);
  if (isProvided(birthWeight) && birthWeightValue === undefined) {
    return res.status(400).json({ message: "Invalid birthWeight." });
  }

  const heightValue = parseNumber(height);
  if (isProvided(height) && heightValue === undefined) {
    return res.status(400).json({ message: "Invalid height." });
  }

  const weightValue = parseNumber(weight);
  if (isProvided(weight) && weightValue === undefined) {
    return res.status(400).json({ message: "Invalid weight." });
  }

  const child = await prisma.child.update({
    where: { id },
    data: {
      name,
      motherName,
      birthDate: birthDateValue,
      gender,
      birthWeight: birthWeightValue,
      height: heightValue,
      weight: weightValue,
      nutritionStatus,
      stuntingStatus,
      immunization,
      checkupHistory,
      posyanduId,
      orangtuaId
    }
  });

  return res.json({ child });
};

export const deleteChild = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existing = await prisma.child.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Child not found." });
  }

  await prisma.child.delete({ where: { id } });
  return res.json({ message: "Child deleted." });
};
