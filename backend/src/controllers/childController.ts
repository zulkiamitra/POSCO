import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { isProvided, parseDate, parseNumber } from "../utils/parse";

const getDummyHistory = (name: string): any[] => {
  const cleanName = name ? name.trim().toLowerCase() : '';
  const location = 'Posyandu Melati - Kec. Padang Timur';
  if (cleanName === 'rani') {
    return [
      {
        tanggal: '2026-02-10',
        date: '10 Februari 2026',
        bb: 4.2,
        weight: '4.2 kg',
        tb: 54,
        height: '54 cm',
        lingkarKepala: 0,
        headCircumference: '-',
        lingkarLengan: 11.8,
        arm: '11.8 cm',
        statusGizi: 'Normal',
        status: 'Normal',
        note: 'Perkembangan baik, berat naik sesuai harapan. Lanjutkan ASI eksklusif.',
        catatan: 'Perkembangan baik, berat naik sesuai harapan. Lanjutkan ASI eksklusif.',
        location: location,
        tempat: location,
        services: ['+ VITAMIN A', '+ IMUNISASI DPT'],
        layanan: ['+ VITAMIN A', '+ IMUNISASI DPT']
      },
      {
        tanggal: '2026-03-10',
        date: '10 Maret 2026',
        bb: 5.0,
        weight: '5.0 kg',
        tb: 57,
        height: '57 cm',
        lingkarKepala: 0,
        headCircumference: '-',
        lingkarLengan: 12.3,
        arm: '12.3 cm',
        statusGizi: 'Normal',
        status: 'Normal',
        note: 'Tumbuh kembang normal, aktivitas baik. Mulai perkenalkan MPASI halus.',
        catatan: 'Tumbuh kembang normal, aktivitas baik. Mulai perkenalkan MPASI halus.',
        location: location,
        tempat: location,
        services: ['+ VITAMIN A', '+ IMUNISASI POLIO'],
        layanan: ['+ VITAMIN A', '+ IMUNISASI POLIO']
      },
      {
        tanggal: '2026-04-14',
        date: '14 April 2026',
        bb: 5.5,
        weight: '5.5 kg',
        tb: 59,
        height: '59 cm',
        lingkarKepala: 0,
        headCircumference: '-',
        lingkarLengan: 12.5,
        arm: '12.5 cm',
        statusGizi: 'Normal',
        status: 'Normal',
        note: 'Aktif dan responsif. MPASI berjalan baik, lanjutkan dengan variasi.',
        catatan: 'Aktif dan responsif. MPASI berjalan baik, lanjutkan dengan variasi.',
        location: location,
        tempat: location,
        services: ['+ VITAMIN A', '+ IMUNISASI BOOSTER'],
        layanan: ['+ VITAMIN A', '+ IMUNISASI BOOSTER']
      }
    ];
  } else if (cleanName === 'bayu') {
    return [
      {
        tanggal: '2025-04-08',
        date: '08 April 2025',
        bb: 4.2,
        weight: '4.2 kg',
        tb: 55,
        height: '55 cm',
        lingkarKepala: 0,
        headCircumference: '-',
        lingkarLengan: 11.5,
        arm: '11.5 cm',
        statusGizi: 'Berisiko',
        status: 'Berisiko',
        note: 'Bayi baru lahir, kondisi perlu dipantau. Lanjutkan ASI eksklusif.',
        catatan: 'Bayi baru lahir, kondisi perlu dipantau. Lanjutkan ASI eksklusif.',
        location: location,
        tempat: location,
        services: ['+ PEMERIKSAAN UMUM', '+ VITAMIN K'],
        layanan: ['+ PEMERIKSAAN UMUM', '+ VITAMIN K']
      },
      {
        tanggal: '2025-06-10',
        date: '10 Juni 2025',
        bb: 5.8,
        weight: '5.8 kg',
        tb: 62,
        height: '62 cm',
        lingkarKepala: 0,
        headCircumference: '-',
        lingkarLengan: 12.0,
        arm: '12.0 cm',
        statusGizi: 'Berisiko',
        status: 'Berisiko',
        note: 'MPASI berkembang. Perlu protein hewani lebih banyak.',
        catatan: 'MPASI berkembang. Perlu protein hewani lebih banyak.',
        location: location,
        tempat: location,
        services: ['+ VITAMIN A', '+ IMUNISASI POLIO'],
        layanan: ['+ VITAMIN A', '+ IMUNISASI POLIO']
      },
      {
        tanggal: '2025-07-08',
        date: '08 Juli 2025',
        bb: 6.3,
        weight: '6.3 kg',
        tb: 64,
        height: '64 cm',
        lingkarKepala: 0,
        headCircumference: '-',
        lingkarLengan: 12.2,
        arm: '12.2 cm',
        statusGizi: 'Berisiko',
        status: 'Berisiko',
        note: 'Pertumbuhan berlanjut. Pantau kualitas gizi MPASI.',
        catatan: 'Pertumbuhan berlanjut. Pantau kualitas gizi MPASI.',
        location: location,
        tempat: location,
        services: ['+ VITAMIN A', '+ ZINC'],
        layanan: ['+ VITAMIN A', '+ ZINC']
      },
      {
        tanggal: '2025-08-12',
        date: '12 Agustus 2025',
        bb: 6.8,
        weight: '6.8 kg',
        tb: 66,
        height: '66 cm',
        lingkarKepala: 0,
        headCircumference: '-',
        lingkarLengan: 12.3,
        arm: '12.3 cm',
        statusGizi: 'Berisiko',
        status: 'Berisiko',
        note: 'Nafsu makan mulai baik. Lanjutkan edukasi gizi.',
        catatan: 'Nafsu makan mulai baik. Lanjutkan edukasi gizi.',
        location: location,
        tempat: location,
        services: ['+ VITAMIN A', '+ IMUNISASI BOOSTER'],
        layanan: ['+ VITAMIN A', '+ IMUNISASI BOOSTER']
      },
      {
        tanggal: '2025-09-09',
        date: '09 September 2025',
        bb: 7.2,
        weight: '7.2 kg',
        tb: 68,
        height: '68 cm',
        lingkarKepala: 0,
        headCircumference: '-',
        lingkarLengan: 12.4,
        arm: '12.4 cm',
        statusGizi: 'Berisiko',
        status: 'Berisiko',
        note: 'Perlu pemantauan berkelanjutan. Edukasi menu tinggi kalori.',
        catatan: 'Perlu pemantauan berkelanjutan. Edukasi menu tinggi kalori.',
        location: location,
        tempat: location,
        services: ['+ VITAMIN A', '+ ZINC'],
        layanan: ['+ VITAMIN A', '+ ZINC']
      }
    ];
  } else if (cleanName === 'cantika') {
    return [
      {
        tanggal: '2024-12-17',
        date: '17 Desember 2024',
        bb: 4.1,
        weight: '4.1 kg',
        tb: 50,
        height: '50 cm',
        lingkarKepala: 0,
        headCircumference: '-',
        lingkarLengan: 11.2,
        arm: '11.2 cm',
        statusGizi: 'Stunting',
        status: 'Stunting',
        note: 'Bayi baru lahir, perlu pendampingan gizi intensif. ASI eksklusif.',
        catatan: 'Bayi baru lahir, perlu pendampingan gizi intensif. ASI eksklusif.',
        location: location,
        tempat: location,
        services: ['+ PEMERIKSAAN UMUM', '+ VITAMIN K'],
        layanan: ['+ PEMERIKSAAN UMUM', '+ VITAMIN K']
      },
      {
        tanggal: '2025-01-14',
        date: '14 Januari 2025',
        bb: 4.8,
        weight: '4.8 kg',
        tb: 54,
        height: '54 cm',
        lingkarKepala: 0,
        headCircumference: '-',
        lingkarLengan: 11.5,
        arm: '11.5 cm',
        statusGizi: 'Stunting',
        status: 'Stunting',
        note: 'Pertumbuhan lambat. Perbanyak konten gizi ASI dan pemberian IMD.',
        catatan: 'Pertumbuhan lambat. Perbanyak konten gizi ASI dan pemberian IMD.',
        location: location,
        tempat: location,
        services: ['+ VITAMIN A', '+ IMUNISASI DPT'],
        layanan: ['+ VITAMIN A', '+ IMUNISASI DPT']
      },
      {
        tanggal: '2025-02-11',
        date: '11 Februari 2025',
        bb: 5.4,
        weight: '5.4 kg',
        tb: 57,
        height: '57 cm',
        lingkarKepala: 0,
        headCircumference: '-',
        lingkarLengan: 11.8,
        arm: '11.8 cm',
        statusGizi: 'Stunting',
        status: 'Stunting',
        note: 'Pertumbuhan masih lambat. Konsultasi menu tinggi protein dilakukan.',
        catatan: 'Pertumbuhan masih lambat. Konsultasi menu tinggi protein dilakukan.',
        location: location,
        tempat: location,
        services: ['+ VITAMIN A', '+ IMUNISASI POLIO'],
        layanan: ['+ VITAMIN A', '+ IMUNISASI POLIO']
      },
      {
        tanggal: '2025-03-11',
        date: '11 Maret 2025',
        bb: 6.0,
        weight: '6.0 kg',
        tb: 59,
        height: '59 cm',
        lingkarKepala: 0,
        headCircumference: '-',
        lingkarLengan: 12.0,
        arm: '12.0 cm',
        statusGizi: 'Stunting',
        status: 'Stunting',
        note: 'Butuh follow-up rutin. Edukasi pola makan keluarga ditingkatkan.',
        catatan: 'Butuh follow-up rutin. Edukasi pola makan keluarga ditingkatkan.',
        location: location,
        tempat: location,
        services: ['+ VITAMIN A', '+ ZAT BESI'],
        layanan: ['+ VITAMIN A', '+ ZAT BESI']
      },
      {
        tanggal: '2025-04-08',
        date: '08 April 2025',
        bb: 6.5,
        weight: '6.5 kg',
        tb: 61,
        height: '61 cm',
        lingkarKepala: 0,
        headCircumference: '-',
        lingkarLengan: 12.1,
        arm: '12.1 cm',
        statusGizi: 'Stunting',
        status: 'Stunting',
        note: 'Perkembangan perlahan. Lanjutkan pendampingan intensif.',
        catatan: 'Perkembangan perlahan. Lanjutkan pendampingan intensif.',
        location: location,
        tempat: location,
        services: ['+ VITAMIN A', '+ ZAT BESI', '+ IMUNISASI'],
        layanan: ['+ VITAMIN A', '+ ZAT BESI', '+ IMUNISASI']
      }
    ];
  }
  return [
    {
      tanggal: '2026-04-10',
      date: '10 April 2026',
      bb: 6.9,
      weight: '6.9 kg',
      tb: 66,
      height: '66 cm',
      lingkarKepala: 0,
      headCircumference: '-',
      lingkarLengan: 12.0,
      arm: '12.0 cm',
      statusGizi: 'Normal',
      status: 'Normal',
      note: 'Tumbuh sesuai usia, lanjutkan pola makan seimbang.',
      catatan: 'Tumbuh sesuai usia, lanjutkan pola makan seimbang.',
      location: 'Posyandu Kenanga - Kec. Padang Utara',
      tempat: 'Posyandu Kenanga - Kec. Padang Utara',
      services: ['+ VITAMIN A'],
      layanan: ['+ VITAMIN A']
    }
  ];
};

const populateChildHistory = (child: any) => {
  if (!child) return child;
  let history = child.checkupHistory;
  if (!history || (Array.isArray(history) && history.length === 0)) {
    history = getDummyHistory(child.name || '');
  }
  return {
    ...child,
    checkupHistory: history
  };
};

export const listChildren = async (req: Request, res: Response) => {
  const posyanduId = req.query.posyanduId ? String(req.query.posyanduId) : undefined;
  const orangtuaId = req.query.orangtuaId ? String(req.query.orangtuaId) : undefined;

  let whereClause: any = {};
  if (posyanduId) {
    whereClause.posyanduId = posyanduId;
  }

  if (orangtuaId) {
    const parentUser = await prisma.user.findUnique({ where: { id: orangtuaId } });
    if (parentUser) {
      const parentName = parentUser.name || "";
      const parentEmail = parentUser.email || "";

      // Find children linked by ID, or where motherName matches parent name or email (case-insensitive)
      const matches = await prisma.child.findMany({
        where: {
          posyanduId,
          OR: [
            { orangtuaId },
            { motherName: { equals: parentName, mode: 'insensitive' } },
            { motherName: { equals: parentEmail, mode: 'insensitive' } },
            { motherName: { contains: parentName, mode: 'insensitive' } }
          ]
        },
        orderBy: { createdAt: "desc" }
      });

      // Permenantly link matching children to this parent user
      const unlinkedIds = matches.filter(c => !c.orangtuaId).map(c => c.id);
      if (unlinkedIds.length > 0) {
        try {
          await prisma.child.updateMany({
            where: { id: { in: unlinkedIds } },
            data: { orangtuaId }
          });
        } catch (err) {
          console.error("Gagal mengupdate orangtuaId secara otomatis:", err);
        }

        // Return updated list
        const updatedMatches = await prisma.child.findMany({
          where: {
            posyanduId,
            OR: [
              { orangtuaId },
              { motherName: { equals: parentName, mode: 'insensitive' } },
              { motherName: { equals: parentEmail, mode: 'insensitive' } },
              { motherName: { contains: parentName, mode: 'insensitive' } }
            ]
          },
          orderBy: { createdAt: "desc" }
        });
        return res.json({ data: updatedMatches.map(populateChildHistory) });
      }

      return res.json({ data: matches.map(populateChildHistory) });
    } else {
      whereClause.orangtuaId = orangtuaId;
    }
  }

  const children = await prisma.child.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" }
  });

  return res.json({ data: children.map(populateChildHistory) });
};

export const getChild = async (req: Request, res: Response) => {
  const { id } = req.params;

  const child = await prisma.child.findUnique({ where: { id } });
  if (!child) {
    return res.status(404).json({ message: "Child not found." });
  }

  return res.json({ child: populateChildHistory(child) });
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

  // Resolve posyanduId from logged-in user if missing
  let resolvedPosyanduId = posyanduId;
  if (!resolvedPosyanduId && (req as any).user?.id) {
    const loggedInUser = await prisma.user.findUnique({ where: { id: (req as any).user.id } });
    if (loggedInUser && loggedInUser.posyanduId) {
      resolvedPosyanduId = loggedInUser.posyanduId;
    }
  }

  // Resolve orangtuaId from motherName matching user name if missing
  let resolvedOrangtuaId = orangtuaId;
  if (!resolvedOrangtuaId && motherName) {
    const parentUser = await prisma.user.findFirst({
      where: {
        role: "orangtua",
        name: { equals: motherName, mode: 'insensitive' }
      }
    });
    if (parentUser) {
      resolvedOrangtuaId = parentUser.id;
    }
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
      posyanduId: resolvedPosyanduId,
      orangtuaId: resolvedOrangtuaId
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

  // Resolve posyanduId from logged-in user if missing
  let resolvedPosyanduId = posyanduId;
  if (!resolvedPosyanduId && (req as any).user?.id) {
    const loggedInUser = await prisma.user.findUnique({ where: { id: (req as any).user.id } });
    if (loggedInUser && loggedInUser.posyanduId) {
      resolvedPosyanduId = loggedInUser.posyanduId;
    }
  }

  // Resolve orangtuaId from motherName matching user name if missing
  let resolvedOrangtuaId = orangtuaId;
  if (!resolvedOrangtuaId && motherName) {
    const parentUser = await prisma.user.findFirst({
      where: {
        role: "orangtua",
        name: { equals: motherName, mode: 'insensitive' }
      }
    });
    if (parentUser) {
      resolvedOrangtuaId = parentUser.id;
    }
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
      posyanduId: resolvedPosyanduId,
      orangtuaId: resolvedOrangtuaId
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
