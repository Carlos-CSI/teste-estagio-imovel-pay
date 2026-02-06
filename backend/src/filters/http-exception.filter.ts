import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientInitializationError,
} from '@prisma/client/runtime/library';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
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
      // Sanitize and map Prisma errors to safe HTTP responses
      // Log full details server-side
      this.logger.error(exception.message, JSON.stringify({ code: exception.code, meta: exception.meta }));

      switch (exception.code) {
        case 'P2002': {
          status = HttpStatus.CONFLICT;
          const rawTarget = exception.meta?.target;
          let targetStr = '';
          if (Array.isArray(rawTarget)) {
            targetStr = rawTarget.join(', ');
          } else if (typeof rawTarget === 'string') {
            targetStr = rawTarget;
          }
          message = targetStr ? `Conflict on: ${targetStr}` : 'Conflict: unique constraint';
          break;
        }
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Resource not found';
          break;
        case 'P2003':
          status = HttpStatus.BAD_REQUEST;
          message = 'Foreign key constraint failed';
          break;
        default:
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = 'Database error';
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Map Prisma initialization errors to 503 and log critical failure
    if (exception instanceof PrismaClientInitializationError) {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = 'Database unavailable';
      this.logger.error('PrismaClientInitializationError', exception as any);
    }

    // Log server errors for observability
    if (status >= 500) {
      this.logger.error(exception as any);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
