-- CreateTable
CREATE TABLE "public"."SetupStatus" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "isSetup" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SetupStatus_pkey" PRIMARY KEY ("id")
);
