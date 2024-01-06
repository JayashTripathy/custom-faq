/*
  Warnings:

  - The `theme` column on the `Faq` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "THEME" AS ENUM ('PURPLE', 'YELLOW', 'ZINC', 'ORANGE');

-- AlterTable
ALTER TABLE "Faq" DROP COLUMN "theme",
ADD COLUMN     "theme" "THEME" NOT NULL DEFAULT 'PURPLE';
