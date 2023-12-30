/*
  Warnings:

  - The `font` column on the `Faq` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "FONT" AS ENUM ('ROBOTO', 'OPEN_SANS', 'LATO', 'POPPINS');

-- AlterTable
ALTER TABLE "Faq" DROP COLUMN "font",
ADD COLUMN     "font" "FONT" NOT NULL DEFAULT 'LATO';

-- DropEnum
DROP TYPE "FONTS";
