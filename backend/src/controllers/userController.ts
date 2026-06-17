import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../db/prisma";
import { supabaseAdmin } from "../db/supabase";

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  nik: true,
  phone: true,
  wilayah: true,
  posyanduId: true,
  createdAt: true,
  updatedAt: true
};

export const listUsers = async (req: Request, res: Response) => {
  const role = req.query.role ? String(req.query.role) : undefined;
  const posyanduId = req.query.posyanduId ? String(req.query.posyanduId) : undefined;

  const users = await prisma.user.findMany({
    where: { role, posyanduId },
    select: userSelect,
    orderBy: { createdAt: "desc" }
  });

  return res.json({ data: users });
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelect
  });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.json({ user });
};

export const createUser = async (req: Request, res: Response) => {
  const { email, password, name, role, nik, phone, wilayah, posyanduId } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    return res.status(409).json({ message: "Email already registered." });
  }

  if (nik) {
    const existingNik = await prisma.user.findUnique({ where: { nik } });
    if (existingNik) {
      return res.status(409).json({ message: "NIK already registered." });
    }
  }

  // 1. Create user in Supabase Auth via Admin API
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (error || !data?.user) {
    return res.status(500).json({ message: error?.message || "Failed to create user in Supabase Auth." });
  }

  const supabaseUser = data.user;

  // 2. Create profile in database matching the Supabase UID
  try {
    const user = await prisma.user.create({
      data: {
        id: supabaseUser.id, // UID from Supabase Auth!
        email,
        passwordHash: "", // Not needed as Supabase Auth validates it
        name,
        role: role || "orangtua",
        nik: typeof nik === "string" && nik.trim() ? nik : undefined,
        phone: typeof phone === "string" && phone.trim() ? phone : undefined,
        wilayah: typeof wilayah === "string" && wilayah.trim() ? wilayah : undefined,
        posyanduId: typeof posyanduId === "string" && posyanduId.trim() ? posyanduId : undefined,
      },
      select: userSelect
    });

    return res.status(201).json({ user });
  } catch (dbError: any) {
    // Rollback Supabase user if database sync fails
    await supabaseAdmin.auth.admin.deleteUser(supabaseUser.id);
    return res.status(500).json({ message: dbError.message || "Failed to create user profile in database." });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, password, name, role, nik, phone, wilayah, posyanduId } = req.body ?? {};

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "User not found." });
  }

  if (email && email !== existing.email) {
    const emailOwner = await prisma.user.findUnique({ where: { email } });
    if (emailOwner) {
      return res.status(409).json({ message: "Email already registered." });
    }
  }

  if (nik && nik !== existing.nik) {
    const nikOwner = await prisma.user.findUnique({ where: { nik } });
    if (nikOwner) {
      return res.status(409).json({ message: "NIK already registered." });
    }
  }

  const shouldUpdatePassword = password && password.trim() && !password.includes("•") && !password.includes("·");
  
  if (email && email !== existing.email) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(id, { email });
    if (error) {
      return res.status(500).json({ message: error.message || "Failed to update email in Supabase Auth." });
    }
  }

  if (shouldUpdatePassword) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(id, { password });
    if (error) {
      return res.status(500).json({ message: error.message || "Failed to update password in Supabase Auth." });
    }
  }

  const passwordHash = shouldUpdatePassword ? await bcrypt.hash(password, 10) : undefined;

  const user = await prisma.user.update({
    where: { id },
    data: {
      email,
      name,
      role,
      nik,
      phone,
      wilayah,
      posyanduId,
      ...(passwordHash ? { passwordHash } : {})
    },
    select: userSelect
  });

  return res.json({ user });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "User not found." });
  }

  await prisma.user.delete({ where: { id } });
  return res.json({ message: "User deleted." });
};
