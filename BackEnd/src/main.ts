import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Load config
    const configService = app.get(ConfigService);

    // Add CORS support
    const frontendSite = configService.get<string>('FRONTEND_SITE', '');
    if (frontendSite !== '') {
        app.enableCors({
            origin: frontendSite,
        });
    }

    // Register global error handling function
    app.useGlobalFilters(new HttpExceptionFilter());

    // Validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: false,
            },
        }),
    );

    await app.listen(configService.get<number>('SERVER_PORT', 3000));
}
void bootstrap();
