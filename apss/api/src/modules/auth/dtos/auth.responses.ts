import { ApiProperty } from '@nestjs/swagger';

class UserSafeResponse {
    @ApiProperty({ example: 'cku...cuid' })
    id!: string;

    @ApiProperty({ example: 'user@bokira.dev' })
    email!: string;

    @ApiProperty({ example: 'Daniel Suárez' })
    name!: string;

    @ApiProperty({ example: '999888777', nullable: true })
    phone!: string | null;

    @ApiProperty({ example: 'USER', enum: ['USER', 'ADMIN'] })
    globalRole!: 'USER' | 'ADMIN';

    @ApiProperty({ example: true })
    isActive!: boolean;

    @ApiProperty({ example: '2025-12-26T22:40:00.000Z' })
    createdAt!: string;
}

export class RegisterResponseDto {
    @ApiProperty({ type: UserSafeResponse })
    user!: UserSafeResponse;
}

export class LoginResponseDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    token!: string;

    @ApiProperty({
        example: {
            id: 'cku...cuid',
            email: 'admin@bokira.dev',
            name: 'Bokira Admin',
            phone: null,
            globalRole: 'ADMIN',
        },
    })
    user!: {
        id: string;
        email: string;
        name: string;
        phone: string | null;
        globalRole: 'USER' | 'ADMIN';
    };
}

export class MeResponseDto extends UserSafeResponse { }
