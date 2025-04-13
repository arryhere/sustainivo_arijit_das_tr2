import express from 'express';
import { config } from './config/config.js';

async function main() {
  try {
    const app = express();

    const port = config.APP_PORT;
    const host = config.APP_HOST;

    

    app.listen(port, () => {
      console.log(`Server is running http://${host}:${port}`);
    });
  } catch (error) {
    console.log('Error:', error);
  }
}

void main();
