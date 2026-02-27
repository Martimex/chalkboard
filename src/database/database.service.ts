import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class DatabaseService extends PrismaClient {
    constructor(config: ConfigService) {
        super({
            adapter: new PrismaPg({
                connectionString: config.get("DATABASE_URL")
            })
        });
    }
}
