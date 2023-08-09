import { EsQueriesService } from './esqueries.service';
import { Module } from '@nestjs/common';

@Module({
  exports: [EsQueriesService],
})
export class EsQueriesModule {}
