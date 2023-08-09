import { Controller, UseGuards, Get, Param, Request, Req, Post, Logger, InternalServerErrorException, Body, Query, DefaultValuePipe, ParseIntPipe, Patch, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';
import axios from 'axios';
import { HistoryService } from 'src/model/services/history.service';

@Controller('api')
export class TestController {
    constructor(
        private config: ConfigService,
        private historyService: HistoryService

    ) { }

    @Post('/history')
    async updatePost(@Body() body: any): Promise<any> {
        console.log("we are here")
        // console.log(body)
        // body = JSON.parse(body)
        return await this.historyService.storeHistory(body.body, body.entities, body.user)
        // return await this.postService.updatePost(postDTO)
    }
}
