import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { isProvided, parseDate } from "../utils/parse";

export const listReferrals = async (req: Request, res: Response) => {
  const status = req.query.status ? String(req.query.status) : undefined;

  const referrals = await prisma.referral.findMany({
    where: { status },
    orderBy: { createdAt: "desc" }
  });

  return res.json({ data: referrals });
};

export const getReferral = async (req: Request, res: Response) => {
  const { id } = req.params;

  const referral = await prisma.referral.findUnique({ where: { id } });
  if (!referral) {
    return res.status(404).json({ message: "Referral not found." });
  }

  return res.json({ referral });
};

export const createReferral = async (req: Request, res: Response) => {
  const { childName, reason, destination, date, status, kaderName } = req.body ?? {};

  if (!childName) {
    return res.status(400).json({ message: "childName is required." });
  }

  const dateValue = parseDate(date);
  if (isProvided(date) && dateValue === undefined) {
    return res.status(400).json({ message: "Invalid date." });
  }

  const referral = await prisma.referral.create({
    data: {
      childName,
      reason,
      destination,
      date: dateValue,
      status,
      kaderName
    }
  });

  return res.status(201).json({ referral });
};

export const updateReferral = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { childName, reason, destination, date, status, kaderName } = req.body ?? {};

  const existing = await prisma.referral.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Referral not found." });
  }

  const dateValue = parseDate(date);
  if (isProvided(date) && dateValue === undefined) {
    return res.status(400).json({ message: "Invalid date." });
  }

  const referral = await prisma.referral.update({
    where: { id },
    data: {
      childName,
      reason,
      destination,
      date: dateValue,
      status,
      kaderName
    }
  });

  return res.json({ referral });
};

export const deleteReferral = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existing = await prisma.referral.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Referral not found." });
  }

  await prisma.referral.delete({ where: { id } });
  return res.json({ message: "Referral deleted." });
};
