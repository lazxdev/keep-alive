import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.UNAUTHORIZED && request.path === '/') {
      return response.redirect('/login');
    }

    let message = 'Internal server error';
    if (exception instanceof HttpException) {
      const responseObj = exception.getResponse();
      message = typeof responseObj === 'string' ? responseObj : (responseObj as any).message || responseObj;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.error(`HTTP Status: ${status} Error Message: ${JSON.stringify(message)}`, exception instanceof Error ? exception.stack : '');

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
