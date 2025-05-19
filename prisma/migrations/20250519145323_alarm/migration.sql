/*
  Warnings:

  - The values [replies] on the enum `Aria` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Aria_new" AS ENUM ('comment', 'follow', 'bookmark');
ALTER TABLE "Alarm" ALTER COLUMN "aria" TYPE "Aria_new" USING ("aria"::text::"Aria_new");
ALTER TYPE "Aria" RENAME TO "Aria_old";
ALTER TYPE "Aria_new" RENAME TO "Aria";
DROP TYPE "Aria_old";
COMMIT;
