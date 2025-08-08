-- CreateTable
CREATE TABLE "public"."AdminSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "maxPeople" INTEGER NOT NULL,
    "maxAccommodation" INTEGER NOT NULL,
    "avgReservationLength" INTEGER NOT NULL,
    "daysJson" JSONB NOT NULL,
    "customDaysJson" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Booking" (
    "id" SERIAL NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "numberOfPeople" INTEGER NOT NULL,
    "reservationDate" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "specialRequests" TEXT,
    "calendarEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);
