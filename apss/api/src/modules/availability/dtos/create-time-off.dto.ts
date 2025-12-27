import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTimeOffDto {
    @ApiPropertyOptional({
        description: 'If omitted/null => business-wide block. If provided => block for that staff userId',
        example: 'cuid_staff_user_id',
    })
    @IsOptional()
    @IsString()
    staffId?: string;

    @ApiProperty({ example: '2025-12-30T14:00:00.000Z' })
    @IsISO8601()
    startAt!: string;

    @ApiProperty({ example: '2025-12-30T18:00:00.000Z' })
    @IsISO8601()
    endAt!: string;

    @ApiPropertyOptional({ example: 'Cita médica' })
    @IsOptional()
    @IsString()
    reason?: string;
}
