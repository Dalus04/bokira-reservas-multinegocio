import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class RescheduleBookingDto {
    @ApiProperty({ example: '2025-12-30T16:00:00.000Z' })
    @IsISO8601()
    startAt!: string;

    @ApiPropertyOptional({ example: 'Reprogramado por cruce de agenda' })
    @IsOptional()
    @IsString()
    reason?: string;

    @ApiPropertyOptional({ example: 'cuid_staff_user_id' })
    @IsOptional()
    @IsString()
    staffId?: string;
}
