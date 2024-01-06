/*
  Warnings:

  - The values [PURPLE] on the enum `THEME` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "THEME_new" AS ENUM ('VIOLET', 'YELLOW', 'ZINC', 'ORANGE', 'VIOLET_LIGHT', 'YELLOW_LIGHT', 'ZINC_LIGHT', 'ORANGE_LIGHT');
ALTER TABLE "Faq" ALTER COLUMN "theme" DROP DEFAULT;
ALTER TABLE "Faq" ALTER COLUMN "theme" TYPE "THEME_new" USING ("theme"::text::"THEME_new");
ALTER TYPE "THEME" RENAME TO "THEME_old";
ALTER TYPE "THEME_new" RENAME TO "THEME";
DROP TYPE "THEME_old";
ALTER TABLE "Faq" ALTER COLUMN "theme" SET DEFAULT 'VIOLET';
COMMIT;

-- AlterTable
ALTER TABLE "Faq" ALTER COLUMN "theme" SET DEFAULT 'VIOLET';
