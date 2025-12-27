import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PublicListBusinessesQueryDto } from './dtos/public-list-businesses.query';
import { PublicListBusinessesUseCase } from './use-cases/public-list-businesses.usecase';
import { PublicGetBusinessBySlugUseCase } from './use-cases/public-get-business-by-slug.usecase';

@ApiTags('businesses')
@Controller('businesses')
export class BusinessesPublicController {
    constructor(
        private readonly listUC: PublicListBusinessesUseCase,
        private readonly getUC: PublicGetBusinessBySlugUseCase,
    ) { }

    @Get()
    @ApiOperation({ summary: 'List businesses (public, APPROVED only)' })
    list(@Query() query: PublicListBusinessesQueryDto) {
        return this.listUC.exec(query);
    }

    @Get(':slug')
    @ApiOperation({ summary: 'Get business by slug (public, APPROVED only)' })
    @ApiParam({ name: 'slug', example: 'nova-barber' })
    getBySlug(@Param('slug') slug: string) {
        return this.getUC.exec(slug);
    }
}
