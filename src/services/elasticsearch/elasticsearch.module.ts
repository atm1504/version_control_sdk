import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EsService } from './elasticsearch.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ES_URL'),
        auth: {
          username: configService.get('ES_USERNAME'),
          password: configService.get('ES_PASSWORD'),
        },

        requestTimeout: 180000,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EsService],
  exports: [EsService],
})
export class ElasticSearchModule {}
