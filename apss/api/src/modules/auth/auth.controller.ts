import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterResponseDto, LoginResponseDto, MeResponseDto } from './dtos/auth.responses';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { RegisterUseCase } from './use-cases/register.usecase';
import { LoginUseCase } from './use-cases/login.usecase';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { CurrentUser, type JwtUserPayload } from '../../common/decorators/current-user.decorator';
import { MeUseCase } from './use-cases/me.usecase';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly registerUC: RegisterUseCase,
        private readonly loginUC: LoginUseCase,
        private readonly meUC: MeUseCase,
    ) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({
        type: RegisterDto,
        examples: {
            user: {
                summary: 'User example',
                value: { email: 'user@bokira.dev', password: 'User12345!', name: 'Daniel Suárez', phone: '999888777' },
            },
        },
    })
    @ApiCreatedResponse({ type: RegisterResponseDto })
    async register(@Body() dto: RegisterDto) {
        const user = await this.registerUC.exec(dto);
        return { user };
    }

    @Post('login')
    @ApiOperation({ summary: 'Login and get JWT' })
    @ApiBody({
        type: LoginDto,
        examples: {
            admin: {
                summary: 'Admin login',
                value: { email: 'admin@bokira.dev', password: 'Admin12345!' },
            },
        },
    })
    @ApiOkResponse({ type: LoginResponseDto })
    async login(@Body() dto: LoginDto) {
        return this.loginUC.exec(dto);
    }

    @Get('me')
    @UseGuards(JwtGuard)
    @ApiBearerAuth('bearer')
    @ApiOperation({ summary: 'Get current user info' })
    @ApiOkResponse({ type: MeResponseDto })
    async me(@CurrentUser() user: JwtUserPayload) {
        return this.meUC.exec(user.sub);
    }
}
