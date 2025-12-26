import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { EnvService } from './env.service';

@Global()
@Module({
    imports: [NestConfigModule.forRoot({ isGlobal: true })],
    providers: [EnvService],
    exports: [EnvService],
})
export class AppConfigModule { }
