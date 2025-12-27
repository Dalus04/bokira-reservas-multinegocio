import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ListPlatformCategoriesQueryDto } from './dtos/list-platform-categories.query';
import { ListPlatformCategoriesUseCase } from './use-cases/list-platform-categories.usecase';
import { GetPlatformCategoryBySlugUseCase } from './use-cases/get-platform-category-by-slug.usecase';

@ApiTags('platform-categories')
@Controller('platform-categories')
export class PlatformCategoriesPublicController {
    constructor(
        private readonly listUC: ListPlatformCategoriesUseCase,
        private readonly getBySlugUC: GetPlatformCategoryBySlugUseCase,
    ) { }

    @Get()
    @ApiOperation({ summary: 'List platform categories (public)' })
    @ApiOkResponse({
        schema: {
            example: {
                items: [{ id: 'cuid', name: 'Barberías', slug: 'barberias', createdAt: '2025-12-26T00:00:00.000Z' }],
                page: 1,
                limit: 20,
                total: 6,
            },
        },
    })
    list(@Query() query: ListPlatformCategoriesQueryDto) {
        return this.listUC.exec(query);
    }

    @Get(':slug')
    @ApiOperation({ summary: 'Get platform category by slug (public)' })
    @ApiParam({ name: 'slug', example: 'barberias' })
    @ApiOkResponse({
        schema: {
            example: { id: 'cuid', name: 'Barberías', slug: 'barberias', createdAt: '2025-12-26T00:00:00.000Z' },
        },
    })
    getBySlug(@Param('slug') slug: string) {
        return this.getBySlugUC.exec(slug);
    }
}
