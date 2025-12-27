import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

const statuses = ['PENDING', 'PROCESSING', 'SENT', 'FAILED', 'CANCELLED'] as const;

export class ListNotificationJobsDto {
    @ApiPropertyOptional({ enum: statuses, example: 'PENDING' })
    @IsOptional()
    @IsIn(statuses)
    status?: (typeof statuses)[number];

    @ApiPropertyOptional({ example: 1, default: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiPropertyOptional({ example: 20, default: 20 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit: number = 20;
}
