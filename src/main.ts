import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '.env') });
import 'reflect-metadata';
import cluster from 'cluster';
import os from 'os';
import { registerEnvironments } from '@shared/environments';
import { Database } from './models/db';
import { container, inject, injectable } from 'tsyringe';
import express, { NextFunction, Response, Request, Express } from 'express';
import { ValidationError } from 'class-validator';
import { IENV_RUN_MODE } from '@shared/types';
import { InvalidDataError, PermissionError } from '@shared/error-class';
import { initAllRoutes, router } from '@controllers/routes';
import { initModels, registerModels } from './models';

@injectable()
class LibraryBackendService {
  private cpuCount: number = 0;

  constructor(
    private database: Database,
    @inject('RUN_MODE') private appRunMode: IENV_RUN_MODE,
  ) {
    this.cpuCount = os.cpus().length;
  }

  private initExpressApp() {
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));
    return app;
  }

  private injectGeneralErrorHandler(app: Express) {
    app.use((err: Error | ValidationError[], req: Request, res: Response, next: NextFunction) => {
      if (Array.isArray(err)) res.status(422).send({ message: 'Validation Error', details: err });
      else if (err instanceof PermissionError || err instanceof InvalidDataError) {
        const errMessage = `response-error() ${err.name}: ${err.message} -- ${req.method} ${req.url}`;
        console.error(errMessage);
        res.status(422).json({ message: `${err.name}: ${err.message}`, details: [] });
      } else {
        const errMessage = `response-error() ${err.name}: ${err.message} -- ${req.method} ${req.url}`;
        console.error(errMessage);
        res.status(422).json({ message: `Something went wrong. ${err.name}: ${err.message}`, details: [] });
      }
    });
  }

  private async initServer() {
    await this.database.connectDB();
    initModels();
    if (this.appRunMode == 'dev') await this.database.sequelize.sync();

    const PORT = 3000;

    const app = this.initExpressApp();
    initAllRoutes();
    app.use(router);
    this.injectGeneralErrorHandler(app);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server Started: http://localhost:${PORT}`);
    });
  }

  private async initCluster() {
    // master node
    await this.database.connectDB();
    initModels();
    await this.database.sequelize.sync();

    cluster.on('fork', (worker) => console.log(`Worker started PID = ${worker.process.pid}`));
    cluster.on('exit', (worker) => {
      console.error(`Worker stopped PID = ${worker.process.pid}`);
      console.warn('Worker restarting...');
      cluster.fork();
    });

    for (let i = 0; i < this.cpuCount; i++) cluster.fork();
  }

  async start() {
    console.log(`App starting with: ${this.appRunMode}`);
    process.on('uncaughtException', (err) => {
      console.error(`uncaughtException: ${err.name} ${err.message}`);
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    });

    if (this.appRunMode == 'dev') this.initServer();
    else {
      // prod || dev ..
      if (cluster.isPrimary) this.initCluster();
      else this.initServer();
    }
  }
}
registerModels();
registerEnvironments();
const app = container.resolve(LibraryBackendService);
app.start();
