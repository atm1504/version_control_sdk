import { Module } from '@nestjs/common';
import { ModelsModule } from 'src/model/models.module';
import { TestController } from './test.controller';


@Module({
    imports: [ModelsModule],
    providers: [],
    controllers: [TestController],
})
export class TestModule { }
