import { DocumentBuilder } from '@nestjs/swagger';

export function buildSwaggerConfig(opts: {
    title: string;
    description: string;
    version: string;
}) {
    return new DocumentBuilder()
        .setTitle(opts.title)
        .setDescription(opts.description)
        .setVersion(opts.version)
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'Authorization',
                in: 'header',
            },
            'bearer',
        )
        .build();
}
