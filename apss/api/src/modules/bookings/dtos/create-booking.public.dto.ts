import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class CreateBookingPublicDto {
    @ApiProperty({ example: 'cuid_service_id' })
    @IsString()
    serviceId!: string;

    @ApiProperty({ example: '2025-12-30T15:00:00.000Z' })
    @IsISO8601()
    startAt!: string;

    @ApiPropertyOptional({ example: 'cuid_staff_user_id' })
    @IsOptional()
    @IsString()
    staffId?: string;

    @ApiPropertyOptional({ example: 'Quiero corte + barba' })
    @IsOptional()
    @IsString()
    notes?: string;
}
