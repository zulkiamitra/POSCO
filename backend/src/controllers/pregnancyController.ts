import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { isProvided, parseDate, parseNumber, parseBoolean } from "../utils/parse";

export const listPregnancies = async (req: Request, res: Response) => {
  const posyanduId = req.query.posyanduId ? String(req.query.posyanduId) : undefined;
  const highRiskValue = parseBoolean(req.query.highRisk);
  if (isProvided(req.query.highRisk) && highRiskValue === undefined) {
    return res.status(400).json({ message: "Invalid highRisk." });
  }

  let whereClause: any = {};
  if (posyanduId) {
    whereClause.OR = [
      { posyanduId },
      { posyanduId: null }
    ];
  }
  if (highRiskValue !== undefined) {
    whereClause.highRisk = highRiskValue;
  }

  const pregnancies = await prisma.pregnancy.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" }
  });

  return res.json({ data: pregnancies });
};

export const getPregnancy = async (req: Request, res: Response) => {
  const { id } = req.params;

  const pregnancy = await prisma.pregnancy.findUnique({ where: { id } });
  if (!pregnancy) {
    return res.status(404).json({ message: "Pregnancy record not found." });
  }

  return res.json({ pregnancy });
};

export const createPregnancy = async (req: Request, res: Response) => {
  const {
    name,
    age,
    gestationalAge,
    hpht,
    dueDate,
    bloodPressure,
    weight,
    highRisk,
    posyanduId
  } = req.body ?? {};

  if (!name) {
    return res.status(400).json({ message: "name is required." });
  }

  const ageValue = parseNumber(age);
  if (isProvided(age) && ageValue === undefined) {
    return res.status(400).json({ message: "Invalid age." });
  }

  const gestationalAgeValue = parseNumber(gestationalAge);
  if (isProvided(gestationalAge) && gestationalAgeValue === undefined) {
    return res.status(400).json({ message: "Invalid gestationalAge." });
  }

  const weightValue = parseNumber(weight);
  if (isProvided(weight) && weightValue === undefined) {
    return res.status(400).json({ message: "Invalid weight." });
  }

  const hphtValue = parseDate(hpht);
  if (isProvided(hpht) && hphtValue === undefined) {
    return res.status(400).json({ message: "Invalid hpht." });
  }

  const dueDateValue = parseDate(dueDate);
  if (isProvided(dueDate) && dueDateValue === undefined) {
    return res.status(400).json({ message: "Invalid dueDate." });
  }

  const highRiskValue = parseBoolean(highRisk);
  if (isProvided(highRisk) && highRiskValue === undefined) {
    return res.status(400).json({ message: "Invalid highRisk." });
  }

  // Resolve posyanduId from logged-in user if missing
  let resolvedPosyanduId = posyanduId;
  if (!resolvedPosyanduId && (req as any).user?.id) {
    const loggedInUser = await prisma.user.findUnique({ where: { id: (req as any).user.id } });
    if (loggedInUser && loggedInUser.posyanduId) {
      resolvedPosyanduId = loggedInUser.posyanduId;
    }
  }

  const pregnancy = await prisma.pregnancy.create({
    data: {
      name,
      age: ageValue,
      gestationalAge: gestationalAgeValue,
      hpht: hphtValue,
      dueDate: dueDateValue,
      bloodPressure,
      weight: weightValue,
      highRisk: highRiskValue,
      posyanduId: resolvedPosyanduId
    }
  });

  return res.status(201).json({ pregnancy });
};

export const updatePregnancy = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    age,
    gestationalAge,
    hpht,
    dueDate,
    bloodPressure,
    weight,
    highRisk,
    posyanduId
  } = req.body ?? {};

  const existing = await prisma.pregnancy.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Pregnancy record not found." });
  }

  const ageValue = parseNumber(age);
  if (isProvided(age) && ageValue === undefined) {
    return res.status(400).json({ message: "Invalid age." });
  }

  const gestationalAgeValue = parseNumber(gestationalAge);
  if (isProvided(gestationalAge) && gestationalAgeValue === undefined) {
    return res.status(400).json({ message: "Invalid gestationalAge." });
  }

  const weightValue = parseNumber(weight);
  if (isProvided(weight) && weightValue === undefined) {
    return res.status(400).json({ message: "Invalid weight." });
  }

  const hphtValue = parseDate(hpht);
  if (isProvided(hpht) && hphtValue === undefined) {
    return res.status(400).json({ message: "Invalid hpht." });
  }

  const dueDateValue = parseDate(dueDate);
  if (isProvided(dueDate) && dueDateValue === undefined) {
    return res.status(400).json({ message: "Invalid dueDate." });
  }

  const highRiskValue = parseBoolean(highRisk);
  if (isProvided(highRisk) && highRiskValue === undefined) {
    return res.status(400).json({ message: "Invalid highRisk." });
  }

  // Resolve posyanduId from logged-in user if missing
  let resolvedPosyanduId = posyanduId;
  if (!resolvedPosyanduId && (req as any).user?.id) {
    const loggedInUser = await prisma.user.findUnique({ where: { id: (req as any).user.id } });
    if (loggedInUser && loggedInUser.posyanduId) {
      resolvedPosyanduId = loggedInUser.posyanduId;
    }
  }

  const pregnancy = await prisma.pregnancy.update({
    where: { id },
    data: {
      name,
      age: ageValue,
      gestationalAge: gestationalAgeValue,
      hpht: hphtValue,
      dueDate: dueDateValue,
      bloodPressure,
      weight: weightValue,
      highRisk: highRiskValue,
      posyanduId: resolvedPosyanduId
    }
  });

  return res.json({ pregnancy });
};

export const deletePregnancy = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existing = await prisma.pregnancy.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Pregnancy record not found." });
  }

  await prisma.pregnancy.delete({ where: { id } });
  return res.json({ message: "Pregnancy record deleted." });
};
