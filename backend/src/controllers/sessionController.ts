import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { isProvided, parseDate, parseNumber } from "../utils/parse";

const getFallbackPosyanduName = (id: string) => {
  const names = ["Posyandu Mawar", "Posyandu Kenanga", "Posyandu Melati"];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % names.length;
  return names[index];
};

const populateSessionPosyandu = (session: any) => {
  if (!session) return session;
  if (!session.posyandu) {
    const fallbackName = getFallbackPosyanduName(session.id);
    return {
      ...session,
      posyandu: {
        id: session.posyanduId || "fallback-id",
        name: fallbackName,
        kecamatan: "Padang Timur",
        kelurahan: "Padang Timur",
        active: true,
        kaderName: session.kaderName || "Kader Posyandu",
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      }
    };
  }
  return session;
};

const resolveOrCreatePosyanduByName = async (name: string): Promise<string> => {
  const trimmed = name.trim();
  let posyandu = await prisma.posyandu.findFirst({
    where: { name: { equals: trimmed, mode: 'insensitive' } }
  });
  if (!posyandu) {
    posyandu = await prisma.posyandu.create({
      data: {
        name: trimmed,
        kecamatan: "Padang Timur",
        kelurahan: "Padang Timur",
        active: true
      }
    });
  }
  return posyandu.id;
};

const alignSessionAttendance = async (session: any): Promise<any> => {
  if (!session) return session;

  const totalChildrenCount = await prisma.child.count();
  
  // Calculate dynamic attendance from checkups on this session's date
  const children = await prisma.child.findMany({});
  const sessDateStr = new Date(session.date).toISOString().split('T')[0];
  const sessionDateObj = new Date(session.date);
  const localDateStr = new Date(sessionDateObj.getTime() + 7 * 60 * 60 * 1000).toISOString().split('T')[0];
  const targetDates = new Set([sessDateStr, localDateStr]);

  let dynamicCount = 0;
  for (const child of children) {
    const history = child.checkupHistory;
    if (!history || !Array.isArray(history)) continue;

    const attended = history.some((checkup: any) => {
      if (!checkup) return false;
      let checkupDate = checkup.tanggal || checkup.date || "";
      if (!checkupDate) return false;

      if (checkupDate.includes('T')) {
        checkupDate = checkupDate.split('T')[0];
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(checkupDate)) {
        const indMonths: { [key: string]: string } = {
          januari: '01', februari: '02', maret: '03', april: '04', mei: '05', juni: '06',
          juli: '07', agustus: '08', september: '09', oktober: '10', november: '11', desember: '12',
          jan: '01', feb: '02', mar: '03', apr: '04', jun: '06', jul: '07', agu: '08', sep: '09', okt: '10', nov: '11', des: '12'
        };
        const parts = checkupDate.toLowerCase().trim().split(/\s+/);
        if (parts.length === 3) {
          const day = parts[0].padStart(2, '0');
          const month = indMonths[parts[1]] || '01';
          const year = parts[2];
          checkupDate = `${year}-${month}-${day}`;
        } else {
          const slashParts = checkupDate.split('/');
          if (slashParts.length === 3) {
            const day = slashParts[0].padStart(2, '0');
            const month = slashParts[1].padStart(2, '0');
            const year = slashParts[2];
            checkupDate = `${year}-${month}-${day}`;
          }
        }
      }

      return targetDates.has(checkupDate);
    });

    if (attended) {
      dynamicCount++;
    }
  }

  let attendance = dynamicCount;
  if (dynamicCount === 0 && session.attendanceCount !== null && session.attendanceCount !== undefined) {
    attendance = Math.min(session.attendanceCount, totalChildrenCount);
  }

  return {
    ...session,
    attendanceCount: attendance
  };
};

export const listSessions = async (req: Request, res: Response) => {
  const posyanduId = req.query.posyanduId ? String(req.query.posyanduId) : undefined;
  const status = req.query.status ? String(req.query.status) : undefined;

  let whereClause: any = {};
  if (posyanduId) {
    whereClause.OR = [
      { posyanduId },
      { posyanduId: null }
    ];
  }
  if (status) {
    whereClause.status = status;
  }

  const sessions = await prisma.posyanduSession.findMany({
    where: whereClause,
    include: { posyandu: true },
    orderBy: { date: "desc" }
  });

  const populated = sessions.map(populateSessionPosyandu);
  const aligned = await Promise.all(populated.map(alignSessionAttendance));

  return res.json({ data: aligned });
};

export const getSession = async (req: Request, res: Response) => {
  const { id } = req.params;

  const session = await prisma.posyanduSession.findUnique({
    where: { id },
    include: { posyandu: true }
  });
  if (!session) {
    return res.status(404).json({ message: "Session not found." });
  }

  const populated = populateSessionPosyandu(session);
  const aligned = await alignSessionAttendance(populated);

  return res.json({ session: aligned });
};

export const createSession = async (req: Request, res: Response) => {
  let { date, timeRange, attendanceCount, status, kaderName, posyanduId, posyanduName, name, description } = req.body ?? {};

  if (!date) {
    return res.status(400).json({ message: "date is required." });
  }

  const dateValue = parseDate(date);
  if (dateValue === undefined) {
    return res.status(400).json({ message: "Invalid date." });
  }

  let attendanceValue = parseNumber(attendanceCount);
  if (isProvided(attendanceCount) && attendanceValue === undefined) {
    return res.status(400).json({ message: "Invalid attendanceCount." });
  }

  const totalChildrenCount = await prisma.child.count();
  if (attendanceValue !== undefined && attendanceValue > totalChildrenCount) {
    attendanceValue = totalChildrenCount;
  }

  if (!posyanduId && posyanduName) {
    try {
      posyanduId = await resolveOrCreatePosyanduByName(posyanduName);
    } catch (err) {
      console.error("Gagal mendapatkan atau membuat Posyandu:", err);
    }
  }

  // Resolve posyanduId from logged-in user if missing
  let resolvedPosyanduId = posyanduId;
  if (!resolvedPosyanduId && (req as any).user?.id) {
    const loggedInUser = await prisma.user.findUnique({ where: { id: (req as any).user.id } });
    if (loggedInUser && loggedInUser.posyanduId) {
      resolvedPosyanduId = loggedInUser.posyanduId;
    }
  }

  const session = await prisma.posyanduSession.create({
    data: {
      date: dateValue,
      timeRange,
      attendanceCount: attendanceValue,
      status,
      kaderName,
      posyanduId: resolvedPosyanduId,
      name,
      description
    },
    include: { posyandu: true }
  });

  const populated = populateSessionPosyandu(session);
  const aligned = await alignSessionAttendance(populated);

  return res.status(201).json({ session: aligned });
};

export const updateSession = async (req: Request, res: Response) => {
  const { id } = req.params;
  let { date, timeRange, attendanceCount, status, kaderName, posyanduId, posyanduName, name, description } = req.body ?? {};

  const existing = await prisma.posyanduSession.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Session not found." });
  }

  const dateValue = parseDate(date);
  if (isProvided(date) && dateValue === undefined) {
    return res.status(400).json({ message: "Invalid date." });
  }

  let attendanceValue = parseNumber(attendanceCount);
  if (isProvided(attendanceCount) && attendanceValue === undefined) {
    return res.status(400).json({ message: "Invalid attendanceCount." });
  }

  const totalChildrenCount = await prisma.child.count();
  if (attendanceValue !== undefined && attendanceValue > totalChildrenCount) {
    attendanceValue = totalChildrenCount;
  }

  if (!posyanduId && posyanduName) {
    try {
      posyanduId = await resolveOrCreatePosyanduByName(posyanduName);
    } catch (err) {
      console.error("Gagal mendapatkan atau membuat Posyandu:", err);
    }
  }

  // Resolve posyanduId from logged-in user if missing
  let resolvedPosyanduId = posyanduId;
  if (!resolvedPosyanduId && (req as any).user?.id) {
    const loggedInUser = await prisma.user.findUnique({ where: { id: (req as any).user.id } });
    if (loggedInUser && loggedInUser.posyanduId) {
      resolvedPosyanduId = loggedInUser.posyanduId;
    }
  }

  const session = await prisma.posyanduSession.update({
    where: { id },
    data: {
      date: dateValue,
      timeRange,
      attendanceCount: attendanceValue,
      status,
      kaderName,
      posyanduId: resolvedPosyanduId,
      name,
      description
    },
    include: { posyandu: true }
  });

  const populated = populateSessionPosyandu(session);
  const aligned = await alignSessionAttendance(populated);

  return res.json({ session: aligned });
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
