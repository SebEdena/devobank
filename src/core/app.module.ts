import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import writeOrmConfig from 'src/mikro-orm.write.config';
// import readOrmConfig from 'src/mikro-orm.read.config';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    CoreModule,
    MikroOrmModule.forRoot(writeOrmConfig),
    // MikroOrmModule.forRoot({
    //   ...readOrmConfig,
    //   contextName: 'read',
    // }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    AppService,
  ],
})
export class AppModule {}
