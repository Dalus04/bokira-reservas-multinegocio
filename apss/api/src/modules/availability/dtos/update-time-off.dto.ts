import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class UpdateTimeOffDto {
    @ApiPropertyOptional({ example: '2025-12-30T15:00:00.000Z' })
    @IsOptional()
    @IsISO8601()
    startAt?: string;

    @ApiPropertyOptional({ example: '2025-12-30T19:00:00.000Z' })
    @IsOptional()
    @IsISO8601()
    endAt?: string;

    @ApiPropertyOptional({ example: 'Cambio de hora' })
    @IsOptional()
    @IsString()
    reason?: string;
}
