import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { supabaseAdmin } from "../src/db/supabase";
import dotenv from "dotenv";
import path from "path";

// Load env variables explicitly
dotenv.config({ path: path.join(__dirname, "../.env") });

const prisma = new PrismaClient();

async function main() {
  const posyandu = await prisma.posyandu.findFirst({
    where: { name: "Posyandu Melati" },
  });

  const posyanduRecord =
    posyandu ??
    (await prisma.posyandu.create({
      data: {
        name: "Posyandu Melati",
        kecamatan: "Koto Tangah",
        kelurahan: "Batang Kabung Ganting",
        kaderName: "Siti Rahayu",
      },
    }));

  // Seed Admin
  const adminEmail = "admin@posco.id";
  let supabaseAdminUid: string | undefined;

  const { data: adminAuthData, error: adminAuthError } = await supabaseAdmin.auth.admin.createUser({
    email: adminEmail,
    password: "admin123",
    email_confirm: true
  });

  if (adminAuthData?.user?.id) {
    supabaseAdminUid = adminAuthData.user.id;
  } else if (adminAuthError && adminAuthError.message.includes("already registered")) {
    const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = listData?.users.find(u => u.email === adminEmail);
    if (existingUser) {
      supabaseAdminUid = existingUser.id;
    }
  }

  if (supabaseAdminUid) {
    // Force reset/update the password in Supabase Auth to ensure it works
    const { error: resetError } = await supabaseAdmin.auth.admin.updateUserById(supabaseAdminUid, {
      password: "admin123"
    });
    if (resetError) {
      console.warn(`Warning resetting Admin password: ${resetError.message}`);
    } else {
      console.log("Admin password successfully synced/reset to default.");
    }

    const existingCorrectUser = await prisma.user.findUnique({ where: { id: supabaseAdminUid } });
    
    if (!existingCorrectUser) {
      const existingMismatchedUser = await prisma.user.findUnique({ where: { email: adminEmail } });
      if (existingMismatchedUser) {
        await prisma.user.delete({ where: { id: existingMismatchedUser.id } });
        console.log(`Deleted mismatched Prisma user row for ${adminEmail}`);
      }
      
      await prisma.user.create({
        data: {
          id: supabaseAdminUid,
          email: adminEmail,
          name: "Admin Posco",
          passwordHash: "",
          role: "admin",
          wilayah: "Kota Padang",
          posyanduId: posyanduRecord.id,
        },
      });
      console.log("Admin seeded/synced successfully:", adminEmail);
    } else {
      await prisma.user.update({
        where: { id: supabaseAdminUid },
        data: { role: "admin", name: "Admin Posco" }
      });
      console.log("Admin profile synced/updated successfully:", adminEmail);
    }
  } else {
    console.error("Failed to find or create Admin in Supabase Auth:", adminAuthError?.message);
  }

  // Seed Verifikator
  const verifEmail = "verifikator@posco.id";
  let supabaseVerifUid: string | undefined;

  const { data: verifAuthData, error: verifAuthError } = await supabaseAdmin.auth.admin.createUser({
    email: verifEmail,
    password: "verifikator123",
    email_confirm: true
  });

  if (verifAuthData?.user?.id) {
    supabaseVerifUid = verifAuthData.user.id;
  } else if (verifAuthError && verifAuthError.message.includes("already registered")) {
    const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = listData?.users.find(u => u.email === verifEmail);
    if (existingUser) {
      supabaseVerifUid = existingUser.id;
    }
  }

  if (supabaseVerifUid) {
    // Force reset/update the password in Supabase Auth to ensure it works
    const { error: resetError } = await supabaseAdmin.auth.admin.updateUserById(supabaseVerifUid, {
      password: "verifikator123"
    });
    if (resetError) {
      console.warn(`Warning resetting Verifikator password: ${resetError.message}`);
    } else {
      console.log("Verifikator password successfully synced/reset to default.");
    }

    const existingCorrectUser = await prisma.user.findUnique({ where: { id: supabaseVerifUid } });
    
    if (!existingCorrectUser) {
      const existingMismatchedUser = await prisma.user.findUnique({ where: { email: verifEmail } });
      if (existingMismatchedUser) {
        await prisma.user.delete({ where: { id: existingMismatchedUser.id } });
        console.log(`Deleted mismatched Prisma user row for ${verifEmail}`);
      }
      
      await prisma.user.create({
        data: {
          id: supabaseVerifUid,
          email: verifEmail,
          name: "Verifikator Posco",
          passwordHash: "",
          role: "verifikator",
          wilayah: "Kota Padang",
          posyanduId: posyanduRecord.id,
        },
      });
      console.log("Verifikator seeded/synced successfully:", verifEmail);
    } else {
      await prisma.user.update({
        where: { id: supabaseVerifUid },
        data: { role: "verifikator", name: "Verifikator Posco" }
      });
      console.log("Verifikator profile synced/updated successfully:", verifEmail);
    }
  } else {
    console.error("Failed to find or create Verifikator in Supabase Auth:", verifAuthError?.message);
  }

  console.log("Seed completed successfully");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });