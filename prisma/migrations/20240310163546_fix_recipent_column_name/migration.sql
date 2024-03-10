/*
  Warnings:

  - You are about to drop the column `recipent_id` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `recipient_id` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_recipent_id_fkey";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "recipent_id",
ADD COLUMN     "recipient_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
