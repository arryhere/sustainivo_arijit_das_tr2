import cors from 'cors';
import express, { type ErrorRequestHandler, type NextFunction, type Request, type Response } from 'express';
import { config } from './config/config.js';
import { router } from './routes/router.js';

async function main() {
  try {
    const app = express();
    const port = config.APP_PORT;
    const host = config.APP_HOST;

    /* middlewares */
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.use(
      cors({
        credentials: true,
        methods: ['HEAD,GET,POST,PUT,PATCH,DELETE'],
        origin: [],
      })
    );

    /* app router */
    app.use(router);

    /* error handling */
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const error_handler: ErrorRequestHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
      res.status(404).json({
        res,
        status_code: error.status_code || 500,
        response_type: { success: false, message: error.message, data: error.data },
      });
      return;
    };

    app.use(error_handler);

    app.listen(port, () => {
      console.log(`Server is running http://${host}:${port}`);
    });
  } catch (error) {
    console.log('Error:', error);
  }
}

void main();
