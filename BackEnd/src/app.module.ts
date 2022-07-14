import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PingModule } from './ping/ping.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { GitModule } from './git/git.module';

@Module({
    imports: [
        PingModule,
        UsersModule,
        ConfigModule.forRoot({
            envFilePath: [
                // Secoder Deployer could only mount
                // a directory, and dot in filename
                // may cause problems
                'config/config',
                'config/ormconfig',
                '.env',
                '.env.development',
                '.env.development.sample',
            ],
            isGlobal: true,
        }),
        TypeOrmModule.forRoot(),
        ProjectsModule,
        GitModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
