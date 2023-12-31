/*
  Warnings:

  - The values [ROBOTO,OPEN_SANS,POPPINS] on the enum `FONT` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FONT_new" AS ENUM ('LATO', 'QUICKSAND', 'PLAYFAIR', 'CORMORANT');
ALTER TABLE "Faq" ALTER COLUMN "font" DROP DEFAULT;
ALTER TABLE "Faq" ALTER COLUMN "font" TYPE "FONT_new" USING ("font"::text::"FONT_new");
ALTER TYPE "FONT" RENAME TO "FONT_old";
ALTER TYPE "FONT_new" RENAME TO "FONT";
DROP TYPE "FONT_old";
ALTER TABLE "Faq" ALTER COLUMN "font" SET DEFAULT 'LATO';
COMMIT;
