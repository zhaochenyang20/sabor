import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LocalStrategy } from './local.strategy';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { Project } from '../projects/entities/proejct.entity';
import { FunctionalRequirement } from '../projects/entities/functionalRequirement.entity';
import { Iteration } from '../projects/entities/iteration.entity';
import { OriginalRequirement } from '../projects/entities/originalRequirement.entity';
import { SystemService } from '../projects/entities/systemService.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Project,
            OriginalRequirement,
            FunctionalRequirement,
            SystemService,
            Iteration,
        ]),
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_TOKEN'),
                signOptions: {
                    expiresIn: '1d',
                },
            }),
        }),
    ],
    controllers: [UsersController],
    providers: [UsersService, LocalStrategy, JwtStrategy],
    exports: [UsersService],
})
export class UsersModule {}
