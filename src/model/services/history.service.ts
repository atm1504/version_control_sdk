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

    /**
     * Steps:
     * 1: Entities are sorted
     * 2: Form a hash out of the entities input
     * 3: Check wether the hash data exists or not
     * 4: In case hash exists, that is back history of the given entities input is present, which is an update or delete type
     * 5: In case hash doesnot exists, that is back history of the give entities input is absent, which is a creation type
     * 4.1: Check the value at the last stage
     * 4.2: Compare the present value with the last value
     * 4.3: Save the changes in an object with message as MODIFIED
     * 4.4: Save the object with same hash key and an updated version number, could be AI number
     * 5.1: Create a new object with present value, changes as null and message as CREATED
     * 5.2: Save the object with the has in ES and version number as 1
     * 6: Return success or error
     */

    async storeHistory(payload: any, entities: Array<EntityDTO>, user: UserDTO) {


        return "OKAY"

    }

}
