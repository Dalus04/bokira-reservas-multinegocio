import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CancelBookingDto {
    @ApiPropertyOptional({ example: 'El staff no estará disponible' })
    @IsOptional()
    @IsString()
    reason?: string;
}
