import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional } from 'class-validator';

export class UpdateStaffMemberDto {
    @ApiPropertyOptional({ example: 'MANAGER', enum: ['STAFF', 'MANAGER'] })
    @IsOptional()
    @IsIn(['STAFF', 'MANAGER'])
    role?: 'STAFF' | 'MANAGER';

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
