/*
  Warnings:

  - The primary key for the `attendance_file_logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `attendance_file_logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "attendance_file_logs" DROP CONSTRAINT "attendance_file_logs_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "attendance_file_logs_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "attendance_data" (
    "id" SERIAL NOT NULL,
    "emp_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "check_in_time" TIMESTAMP(3) NOT NULL,
    "check_out_time" TIMESTAMP(3) NOT NULL,
    "file_log_id" INTEGER NOT NULL,

    CONSTRAINT "attendance_data_pkey" PRIMARY KEY ("id")
);
