import { BadRequestException, ForbiddenException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import * as _ from 'lodash';

import { ConfigService } from '@nestjs/config';


@Injectable()
export class HistoryService {

    constructor(
        private readonly configService: ConfigService,

    ) { }

}
