import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn } from 'class-validator';

export class AddStaffMemberDto {
    @ApiProperty({ example: 'staff@bokira.dev' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'STAFF', enum: ['STAFF', 'MANAGER'] })
    @IsIn(['STAFF', 'MANAGER'])
    role!: 'STAFF' | 'MANAGER';
}
