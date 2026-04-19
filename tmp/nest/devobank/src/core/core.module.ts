import { Module } from '@nestjs/common';
import { CurrentDateGenerator } from './adapters/current-date-generator';
import { RandomIdGenerator } from './adapters/random-id-generator';
import { I_DATE_GENERATOR } from './ports/date-generator.interface';
import { I_ID_GENERATOR } from './ports/id-generator.interface';
import { I_STRING_HASHER } from './ports/string-hasher.interface';
import { BcryptStringHasher } from './adapters/bcrypt-string-hasher';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: I_DATE_GENERATOR,
      useClass: CurrentDateGenerator,
    },
    {
      provide: I_ID_GENERATOR,
      useClass: RandomIdGenerator,
    },
    {
      provide: I_STRING_HASHER,
      useClass: BcryptStringHasher,
    },
  ],
  exports: [I_DATE_GENERATOR, I_ID_GENERATOR, I_STRING_HASHER],
})
export class CoreModule {}
