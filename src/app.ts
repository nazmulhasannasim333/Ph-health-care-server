import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';
import cookieParser from 'cookie-parser';
import cron from 'node-cron';
import { AppointmentServices } from './app/modules/appointment/appointment.services';
import { errorlogger } from './shared/logger';
import config from './config';

const app: Application = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  }),
);

app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

app.get('/test', async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Server working....!',
  });
});

// Schedule to run every minute
cron.schedule('* * * * *', async (): Promise<void> => {
  try {
    await AppointmentServices.cancelUnpaidAppointments();
  } catch (error) {
    errorlogger.error(error);
  }
});

//global error handler
app.use(globalErrorHandler);

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

export default app;
