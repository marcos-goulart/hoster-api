-- AlterTable
ALTER TABLE "hotels" ADD COLUMN     "about" TEXT;

-- CreateTable
CREATE TABLE "hotel_questions" (
    "id" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotel_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hotel_questions_hotelId_idx" ON "hotel_questions"("hotelId");

-- CreateIndex
CREATE INDEX "hotel_questions_userId_idx" ON "hotel_questions"("userId");

-- AddForeignKey
ALTER TABLE "hotel_questions" ADD CONSTRAINT "hotel_questions_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_questions" ADD CONSTRAINT "hotel_questions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
