import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class AvailabilityPublicQueryDto {
    @ApiProperty({ example: 'cuid_service_id' })
    @IsString()
    serviceId!: string;

    @ApiProperty({ example: '2025-12-30', description: 'YYYY-MM-DD in business timezone' })
    @IsString()
    date!: string;

    @ApiPropertyOptional({ example: 'cuid_staff_user_id' })
    @IsOptional()
    @IsString()
    staffId?: string;
}

export class AvailabilityPrivateQueryDto {
    @ApiProperty({ example: 'cuid_service_id' })
    @IsString()
    serviceId!: string;

    @ApiProperty({ example: '2025-12-30T00:00:00.000Z' })
    @IsISO8601()
    from!: string;

    @ApiProperty({ example: '2025-12-31T23:59:59.999Z' })
    @IsISO8601()
    to!: string;

    @ApiPropertyOptional({ example: 'cuid_staff_user_id' })
    @IsOptional()
    @IsString()
    staffId?: string;
}
