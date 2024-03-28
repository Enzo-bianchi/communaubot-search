import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [SearchController],
  providers: [SearchService, {
    provide: 'MONGO_SERVICE',
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
          host: configService.get('MONGO_SERVICE_HOST'),
          port: configService.get('MONGO_SERVICE_PORT')
        }
      })
    }
    }],
})
export class SearchModule {}
