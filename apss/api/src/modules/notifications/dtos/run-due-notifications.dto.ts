import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class RunDueNotificationsDto {
    @ApiPropertyOptional({ example: 50, default: 50 })
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number = 50;

    @ApiPropertyOptional({ example: false, default: false })
    @Type(() => Boolean)
    @IsOptional()
    @IsBoolean()
    dryRun?: boolean = false;
}
