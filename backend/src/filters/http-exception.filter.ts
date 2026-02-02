import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal server error';

    const joinWithDotNewline = (arr: string[]) => {
      const joined = arr.join('.\n');
      return joined.endsWith('.') ? joined : joined + '.';
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        const respMessage = (exceptionResponse as any).message;
        if (Array.isArray(respMessage)) {
          message = joinWithDotNewline(respMessage);
        } else if (typeof respMessage === 'string') {
          message = respMessage;
        } else {
          message = exception.message || message;
        }
      }
    } else if (exception instanceof PrismaClientKnownRequestError) {
      // Handle Prisma errors
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          const rawTarget = exception.meta?.target;
          let targetStr = '';
          if (Array.isArray(rawTarget)) {
            targetStr = rawTarget.join(', ');
          } else if (typeof rawTarget === 'string') {
            targetStr = rawTarget;
          }
          message = targetStr
            ? `Unique constraint failed: ${targetStr} already exists`
            : 'Unique constraint failed';
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          break;
        case 'P2003':
          status = HttpStatus.BAD_REQUEST;
          message = 'Foreign key constraint failed';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = 'Database error occurred';
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
