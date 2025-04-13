import path from 'node:path';
import { Status } from '@prisma/client';
import { type NextFunction, type Request, type Response, Router } from 'express';
import multer from 'multer';
import { prisma } from '../db/prisma.js';

export const router = Router({ caseSensitive: true, strict: true });

router.get('/', [], (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send('base');
});

router.get('/health', [], (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send('health');
});

router.post('/upload-attendance', [], async (req: Request, res: Response, next: NextFunction) => {
  /* multer */
  const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
      checkFileType(file, cb);
    },
  }).single('myFile');

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  function checkFileType(file: any, cb: any) {
    const filetypes = /jpeg|jpg|csv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb('Error: jpeg|jpg|csv only!');
  }

  upload(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: err });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Please send file' });
    }

    console.log(req.file);

    await prisma.attendanceFileLogs.create({
      data: {
        file_name: req.file.filename,
        status: Status.pending,
      },
    });
    res.send('File uploaded!');
  });
});
