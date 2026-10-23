-- DropForeignKey
ALTER TABLE "hotel_questions" DROP CONSTRAINT "hotel_questions_hotelId_fkey";

-- DropForeignKey
ALTER TABLE "hotel_questions" DROP CONSTRAINT "hotel_questions_userId_fkey";

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "period" TEXT;

-- AddForeignKey
ALTER TABLE "hotel_questions" ADD CONSTRAINT "hotel_questions_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotel_questions" ADD CONSTRAINT "hotel_questions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
