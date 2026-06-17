import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma";
import { env } from "../config/env";
import { supabaseAdmin } from "../db/supabase";

const signToken = (user: { id: string; email: string; role: string }) =>
  jwt.sign(user, env.jwtSecret, { expiresIn: "7d" });

export const register = async (req: Request, res: Response) => {
  const { email, password, name, role, nik, phone, wilayah } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  if (!env.supabaseServiceRoleKey || env.supabaseServiceRoleKey.startsWith("change-me")) {
    return res.status(500).json({ message: "Konfigurasi SUPABASE_SERVICE_ROLE_KEY belum diisi di backend/.env" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
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

  // 2. Create kustom user profile in Prisma matching the Supabase UID
  try {
    const user = await prisma.user.create({
      data: {
        id: supabaseUser.id, // UID from Supabase Auth!
        email,
        passwordHash: "", // Not needed for validation since Supabase Auth handles it
        name,
        role: (typeof role === "string" && role.trim().toLowerCase() === "kader") ? "kader_pending" : (typeof role === "string" && role.trim() ? role : "user"),
        nik: typeof nik === "string" && nik.trim() ? nik : undefined,
        phone: typeof phone === "string" && phone.trim() ? phone : undefined,
        wilayah: typeof wilayah === "string" && wilayah.trim() ? wilayah : undefined,
      },
      select: { id: true, email: true, name: true, role: true }
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    return res.status(201).json({ user, token });
  } catch (dbError: any) {
    // Rollback Supabase user if database sync fails
    await supabaseAdmin.auth.admin.deleteUser(supabaseUser.id);
    return res.status(500).json({ message: dbError.message || "Failed to create user profile in database." });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  if (!env.supabaseServiceRoleKey || env.supabaseServiceRoleKey.startsWith("change-me")) {
    return res.status(500).json({ message: "Konfigurasi SUPABASE_SERVICE_ROLE_KEY belum diisi di backend/.env" });
  }

  // 1. Verify credentials using Supabase Auth
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data?.user) {
    return res.status(401).json({ message: "Email atau kata sandi salah." });
  }

  const supabaseUser = data.user;

  // 2. Fetch profile from database using the Supabase Auth UID
  let user = await prisma.user.findUnique({ where: { id: supabaseUser.id } });

  // Fallback: If user exists in Supabase Auth but somehow not synced in the DB
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: supabaseUser.id,
        email: supabaseUser.email || email,
        passwordHash: "",
        name: email.split("@")[0],
        role: "orangtua"
      }
    });
  }

  if (user.role === "kader_pending") {
    return res.status(403).json({ message: "Akun Kader Anda sedang menunggu verifikasi dari Admin." });
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token
  });
};

export const me = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, name: true, role: true }
  });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.json({ user });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body ?? {};

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  if (!env.supabaseServiceRoleKey || env.supabaseServiceRoleKey.startsWith("change-me")) {
    return res.status(500).json({ message: "Konfigurasi SUPABASE_SERVICE_ROLE_KEY belum diisi di backend/.env" });
  }

  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: "Email tidak terdaftar dalam sistem kami." });
  }

  // Send reset password email via Supabase Auth
  const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:5173/forgot-password"
  });

  if (error) {
    return res.status(500).json({ message: error.message || "Gagal mengirim email pemulihan via Supabase." });
  }

  return res.json({ message: "Verification email/code sent successfully." });
};

export const verifyResetCode = async (req: Request, res: Response) => {
  const { email, code } = req.body ?? {};

  if (!email || !code) {
    return res.status(400).json({ message: "Email and code are required." });
  }

  // Verify the OTP via Supabase Auth
  const { error } = await supabaseAdmin.auth.verifyOtp({
    email,
    token: code,
    type: "recovery"
  });

  if (error) {
    return res.status(400).json({ message: error.message || "Kode verifikasi salah atau kedaluwarsa." });
  }

  return res.json({ message: "Kode verifikasi benar." });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  if (!env.supabaseServiceRoleKey || env.supabaseServiceRoleKey.startsWith("change-me")) {
    return res.status(500).json({ message: "Konfigurasi SUPABASE_SERVICE_ROLE_KEY belum diisi di backend/.env" });
  }

  // 1. Find user profile in our database
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // 2. Reset password directly in Supabase Auth using Admin API
  const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    password: password
  });

  if (error) {
    return res.status(500).json({ message: error.message || "Gagal mereset kata sandi di Supabase Auth." });
  }

  return res.json({ message: "Password updated successfully." });
};
