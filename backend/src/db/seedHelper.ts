import { PrismaClient } from "@prisma/client";
import { supabaseAdmin } from "./supabase";

const prisma = new PrismaClient();

export async function ensureDefaultUsers() {
  console.log("🔄 Running check for default users (Admin & Verifikator)...");
  try {
    // 1. Ensure default posyandu exists
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

    // 2. Ensure default Admin
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
      // Force reset/update password in Supabase Auth to guarantee access
      const { error: resetError } = await supabaseAdmin.auth.admin.updateUserById(supabaseAdminUid, {
        password: "admin123"
      });
      if (resetError) {
        console.warn(`⚠️ Warning resetting Admin password: ${resetError.message}`);
      } else {
        console.log("✅ Admin password synced to default (admin123).");
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
        console.log("✅ Admin user created/synced successfully:", adminEmail);
      } else {
        await prisma.user.update({
          where: { id: supabaseAdminUid },
          data: { role: "admin", name: "Admin Posco" }
        });
        console.log("✅ Admin user profile is synced:", adminEmail);
      }
    } else {
      console.error("❌ Failed to find or create Admin in Supabase Auth:", adminAuthError?.message);
    }

    // 3. Ensure default Verifikator
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
      // Force reset/update password in Supabase Auth to guarantee access
      const { error: resetError } = await supabaseAdmin.auth.admin.updateUserById(supabaseVerifUid, {
        password: "verifikator123"
      });
      if (resetError) {
        console.warn(`⚠️ Warning resetting Verifikator password: ${resetError.message}`);
      } else {
        console.log("✅ Verifikator password synced to default (verifikator123).");
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
        console.log("✅ Verifikator user created/synced successfully:", verifEmail);
      } else {
        await prisma.user.update({
          where: { id: supabaseVerifUid },
          data: { role: "verifikator", name: "Verifikator Posco" }
        });
        console.log("✅ Verifikator user profile is synced:", verifEmail);
      }
    } else {
      console.error("❌ Failed to find or create Verifikator in Supabase Auth:", verifAuthError?.message);
    }

    // 4. Align session attendance counts with the total children in the database
    const totalChildrenCount = await prisma.child.count();
    const sessionsWithHighAttendance = await prisma.posyanduSession.findMany({
      where: {
        attendanceCount: {
          gt: totalChildrenCount
        }
      }
    });

    if (sessionsWithHighAttendance.length > 0) {
      console.log(`🧹 Found ${sessionsWithHighAttendance.length} sessions with attendance count exceeding total children (${totalChildrenCount}). Aligning...`);
      for (const session of sessionsWithHighAttendance) {
        await prisma.posyanduSession.update({
          where: { id: session.id },
          data: {
            attendanceCount: totalChildrenCount
          }
        });
        console.log(`✅ Session ${session.id} date ${session.date} attendanceCount adjusted from ${session.attendanceCount} to ${totalChildrenCount}`);
      }
    }

    console.log("✅ Default users initialization completed.");
  } catch (error) {
    console.error("❌ Error initializing default users:", error);
  } finally {
    await prisma.$disconnect();
  }
}
