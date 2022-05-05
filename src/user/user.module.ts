import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtStrategy } from '@app/auth/strategies/jwt.strategies';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity]), ConfigModule],
	controllers: [UserController],
	providers: [UserService, JwtStrategy],
	exports: [UserService],
})
export class UserModule {}
