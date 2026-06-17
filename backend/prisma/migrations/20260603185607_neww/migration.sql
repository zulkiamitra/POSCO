/*
  Warnings:

  - A unique constraint covering the columns `[nik]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "nik" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "posyanduId" TEXT,
ADD COLUMN     "wilayah" TEXT;

-- CreateTable
CREATE TABLE "Posyandu" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "kelurahan" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "kaderName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Posyandu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "motherName" TEXT,
    "birthDate" TIMESTAMP(3),
    "gender" TEXT,
    "birthWeight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "nutritionStatus" TEXT,
    "stuntingStatus" TEXT,
    "immunization" JSONB,
    "checkupHistory" JSONB,
    "posyanduId" TEXT,
    "orangtuaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pregnancy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "gestationalAge" INTEGER,
    "hpht" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "bloodPressure" TEXT,
    "weight" DOUBLE PRECISION,
    "highRisk" BOOLEAN NOT NULL DEFAULT false,
    "posyanduId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pregnancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PosyanduSession" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "timeRange" TEXT,
    "attendanceCount" INTEGER DEFAULT 0,
    "status" TEXT,
    "kaderName" TEXT,
    "posyanduId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PosyanduSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "childName" TEXT NOT NULL,
    "reason" TEXT,
    "destination" TEXT,
    "date" TIMESTAMP(3),
    "status" TEXT,
    "kaderName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nik_key" ON "User"("nik");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "Posyandu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "Posyandu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_orangtuaId_fkey" FOREIGN KEY ("orangtuaId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pregnancy" ADD CONSTRAINT "Pregnancy_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "Posyandu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosyanduSession" ADD CONSTRAINT "PosyanduSession_posyanduId_fkey" FOREIGN KEY ("posyanduId") REFERENCES "Posyandu"("id") ON DELETE SET NULL ON UPDATE CASCADE;
