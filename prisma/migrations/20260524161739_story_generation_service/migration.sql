-- CreateEnum
CREATE TYPE "GenerationMode" AS ENUM ('co_author', 'autopilot');

-- CreateEnum
CREATE TYPE "GenerationStatus" AS ENUM ('pending', 'queued', 'processing', 'completed', 'failed', 'canceled');

-- CreateTable
CREATE TABLE "StoryGenerationRequest" (
    "id" TEXT NOT NULL,
    "novelId" TEXT,
    "prompt" TEXT NOT NULL,
    "mode" "GenerationMode" NOT NULL,
    "status" "GenerationStatus" NOT NULL DEFAULT 'pending',
    "provider" TEXT NOT NULL,
    "model" TEXT,
    "temperature" DOUBLE PRECISION,
    "maxTokens" INTEGER,
    "output" TEXT,
    "error" TEXT,
    "externalJobId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryGenerationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StoryGenerationRequest_status_createdAt_idx" ON "StoryGenerationRequest"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "StoryGenerationRequest" ADD CONSTRAINT "StoryGenerationRequest_novelId_fkey" FOREIGN KEY ("novelId") REFERENCES "Novel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
