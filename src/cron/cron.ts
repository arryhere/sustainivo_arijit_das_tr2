import path from 'node:path';
import { Status } from '@prisma/client';
import csvtojson from 'csvtojson';
import cron from 'node-cron';
import { prisma } from '../db/prisma.js';

async function cronRunner() {
  cron.schedule('* * * * *', async () => {
    console.log('running a task every minute');

    const pendingLogs = await prisma.attendanceFileLogs.findMany({
      where: {
        status: Status.pending,
      },
    });

    console.log({ pendingLogs });

    for (const log of pendingLogs) {
      try {
        await prisma.attendanceFileLogs.update({
          where: {
            id: log.id,
          },
          data: {
            status: Status.processing,
          },
        });

        const json = await csvtojson().fromFile(path.join(process.cwd(), 'uploads', log.file_name));

        await prisma.attendanceData.createMany({
          data: json.map((item) => ({
            emp_id: Number(item.emp_id),
            date: String(item.date),
            check_in_time: String(item.check_in_time),
            check_out_time: String(item.check_out_time),
            file_log_id: log.id,
          })),
        });

        await prisma.attendanceFileLogs.update({
          where: {
            id: log.id,
          },
          data: {
            status: Status.completed,
          },
        });
      } catch (error) {
        await prisma.attendanceFileLogs.update({
          where: {
            id: log.id,
          },
          data: {
            status: Status.failed,
          },
        });
        console.log('Error cron', error);
      }
    }
  });
}

cronRunner();
