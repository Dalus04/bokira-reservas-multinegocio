import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AdminRejectBusinessDto {
    @ApiProperty({ example: 'Falta documentación' })
    @IsString()
    @MinLength(3)
    reason!: string;
}
