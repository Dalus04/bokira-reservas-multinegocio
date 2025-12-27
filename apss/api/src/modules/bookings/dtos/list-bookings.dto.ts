import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListBookingsDto {
    @ApiPropertyOptional({ example: '2025-12-01T00:00:00.000Z' })
    @IsOptional()
    @IsISO8601()
    from?: string;

    @ApiPropertyOptional({ example: '2025-12-31T23:59:59.999Z' })
    @IsOptional()
    @IsISO8601()
    to?: string;

    @ApiPropertyOptional({ example: 'PENDING' })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiPropertyOptional({ example: 'cuid_staff_user_id' })
    @IsOptional()
    @IsString()
    staffId?: string;

    @ApiPropertyOptional({ example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiPropertyOptional({ example: 20 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit: number = 20;
}
