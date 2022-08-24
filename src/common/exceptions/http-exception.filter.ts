import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger('HTTP');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const error = exception.getResponse() as
      | string
      | { error: string; statusCode: number; message: string | string[] };

    if (typeof error === 'string') {
      response.status(status).json({
        success: false,
        data: {
          timestamp: new Date().toLocaleString(),
          path: request.url,
          query: request.body,
          status: status,
          error,
        },
      });
      this.logger.error({
        timestamp: new Date().toLocaleString(),
        path: request.url,
        query: request.body,
        error,
      });
    } else {
      response.status(status).json({
        success: false,
        data: {
          timestamp: new Date().toLocaleString(),
          qurey: request.body,
          ...error,
        },
      });
      this.logger.error({
        timestamp: new Date().toLocaleString(),
        query: request.body,
        error,
      });
    }
  }
}
