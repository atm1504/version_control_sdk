import { Controller, UseGuards, Get, Param, Request, Req, Post, Logger, InternalServerErrorException, Body, Query, DefaultValuePipe, ParseIntPipe, Patch, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';
import axios from 'axios';
import { HistoryService } from 'src/model/services/history.service';
import { EntityDTO } from 'src/model/entities/history.dto';

@Controller('api')
export class TestController {
    constructor(
        private config: ConfigService,
        private historyService: HistoryService

    ) { }

    @Post('/history')
    async addHistory(@Body() body: any): Promise<any> {
        console.log("we are here")
        // console.log(body)
        // body = JSON.parse(body)
        return await this.historyService.storeHistory(body.body, body.entities, body.user)
        // return await this.postService.updatePost(postDTO)
    }

    @Get('/history')
    async getHistory(@Query('entities') entities: any): Promise<any> {
        console.log("we are here")
        console.log(entities)
        // console.log(body)
        // body = JSON.parse(body)
        return await this.historyService.getHistory(JSON.parse(entities))
        // return await this.postService.updatePost(postDTO)
    }


}
