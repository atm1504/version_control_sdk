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
        return await this.historyService.storeHistory(body.body, body.entities, body.user)
    }

    @Get('/history/:version')
    async getHistoryAtVersion(@Query('entities') entities: any, @Param('version') version: number,
    ): Promise<any> {
        return await this.historyService.getHistoryAtVersion(JSON.parse(entities), version)
    }

    @Get('/history')
    async getHistory(@Query('entities') entities: any): Promise<any> {
        console.log(entities)
        return await this.historyService.getHistory(JSON.parse(entities))
    }
}
