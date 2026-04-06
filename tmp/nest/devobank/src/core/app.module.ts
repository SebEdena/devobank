import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from 'src/mikro-orm.config';

@Module({
  imports: [CoreModule, MikroOrmModule.forRoot(mikroOrmConfig), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
