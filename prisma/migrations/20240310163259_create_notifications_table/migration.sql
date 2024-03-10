-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "recipent_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipent_id_fkey" FOREIGN KEY ("recipent_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;