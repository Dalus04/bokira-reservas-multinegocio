import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ConfirmBookingDto {
    @ApiPropertyOptional({ example: 'Confirmado, te esperamos' })
    @IsOptional()
    @IsString()
    note?: string;
}
