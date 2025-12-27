import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { EnvService } from './env.service';
import { ScheduleModule } from '@nestjs/schedule';

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({ isGlobal: true }),
        ScheduleModule.forRoot(),
    ],
    providers: [EnvService],
    exports: [EnvService],
})
export class AppConfigModule { }
