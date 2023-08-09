import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModelsModule } from './model/models.module';
import { ConfigModule } from '@nestjs/config';
import { ElasticSearchModule } from './services/elasticsearch/elasticsearch.module';
import { TestModule } from './modules/test/test.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ModelsModule,
    ElasticSearchModule,
    TestModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
