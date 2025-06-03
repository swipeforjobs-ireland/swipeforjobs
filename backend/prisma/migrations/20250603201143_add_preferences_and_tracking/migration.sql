-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'FREELANCE');

-- CreateEnum
CREATE TYPE "WorkArrangement" AS ENUM ('ON_SITE', 'REMOTE', 'HYBRID');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('GRADUATE', 'JUNIOR', 'MID_LEVEL', 'SENIOR', 'LEAD', 'EXECUTIVE');

-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('STARTUP', 'SME', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "InterviewType" AS ENUM ('PHONE', 'VIDEO', 'IN_PERSON', 'TECHNICAL', 'PANEL');

-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED', 'NO_SHOW');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ApplicationStatus" ADD VALUE 'INTERVIEW_COMPLETED';
ALTER TYPE "ApplicationStatus" ADD VALUE 'OFFER_ACCEPTED';
ALTER TYPE "ApplicationStatus" ADD VALUE 'OFFER_DECLINED';
ALTER TYPE "ApplicationStatus" ADD VALUE 'WITHDRAWN';

-- AlterEnum
ALTER TYPE "ResponseType" ADD VALUE 'FOLLOW_UP';

-- AlterTable
ALTER TABLE "application_responses" ADD COLUMN     "isPositive" BOOLEAN;

-- AlterTable
ALTER TABLE "job_applications" ADD COLUMN     "followUpDate" TIMESTAMP(3),
ADD COLUMN     "interviewDate" TIMESTAMP(3),
ADD COLUMN     "matchingScore" DOUBLE PRECISION,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "offerDate" TIMESTAMP(3),
ADD COLUMN     "responseDate" TIMESTAMP(3),
ADD COLUMN     "viewedByEmployer" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "companySize" "CompanySize",
ADD COLUMN     "county" TEXT,
ADD COLUMN     "employmentType" "EmploymentType",
ADD COLUMN     "experienceLevel" "ExperienceLevel",
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "maxSalary" INTEGER,
ADD COLUMN     "minSalary" INTEGER,
ADD COLUMN     "workArrangement" "WorkArrangement";

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "employmentTypes" "EmploymentType"[],
    "workArrangements" "WorkArrangement"[],
    "preferredCounties" TEXT[],
    "willingToRelocate" BOOLEAN NOT NULL DEFAULT false,
    "industries" TEXT[],
    "experienceLevel" "ExperienceLevel",
    "minSalary" INTEGER,
    "maxSalary" INTEGER,
    "companySize" "CompanySize"[],
    "benefits" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interviews" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER,
    "type" "InterviewType" NOT NULL,
    "location" TEXT,
    "notes" TEXT,
    "status" "InterviewStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "user_preferences"("userId");

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "job_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
