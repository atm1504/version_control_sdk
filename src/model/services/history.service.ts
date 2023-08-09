import { BadRequestException, ForbiddenException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import * as _ from 'lodash';

import { ConfigService } from '@nestjs/config';
import { EntityDTO, UserDTO } from '../entities/history.dto';


@Injectable()
export class HistoryService {

    constructor(
        private readonly configService: ConfigService,

    ) { }

    /**
     * 
     * @param payload This is the payload which is to be stored
     * @param entities This is the identifier details on the client side. We will generate an unique form of this
     * @param user Details of the user doing the changes
     * 
     * payload={"name":"atm","designation":"senior engineer"}
     * entities=[{"entity":"user","id":12},{"entity":"account","id":5}]
     * user={"id":4,"name":"adsdd","properties":{}}
     */

    async storeHistory(payload: any, entities: Array<EntityDTO>, user: UserDTO) {

        return "OKAY"

    }

}
