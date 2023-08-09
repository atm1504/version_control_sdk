import { BadRequestException, ForbiddenException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import * as _ from 'lodash';

import { ConfigService } from '@nestjs/config';
import { EntityDTO, UserDTO } from '../entities/history.dto';
import { EsQueriesService } from 'src/modules/es/esqueries.service';
import { EsService } from 'src/services/elasticsearch/elasticsearch.service';
import { TYPE } from 'src/services/constants';
const jsonDiff = require('json-diff');



@Injectable()
export class HistoryService {

    constructor(
        private readonly configService: ConfigService,
        private esService: EsService,
        private esQueries: EsQueriesService
    ) { }

    /**
     * This functions enrypts the entities object to a value
     * Naive implementation
     * @param entities array
     */
    encrypt(entities: Array<EntityDTO>) {
        let s = ''
        entities.map(t => {
            s += t.entity + "-" + t.id.toString() + "#"
        })
        return s

    }

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
     * 5.1: Create a new object with present value, changes as empty object and message as CREATED
     * 5.2: Save the object with the hash in ES and version number as 1
     * 6: Return success or error
     */

    async storeHistory(payload: any, entities: Array<EntityDTO>, user: UserDTO) {
        // Step 1 and 2:  Form a hash out of the entities input
        const hash = this.encrypt(entities)

        // Step 3: Check wether key exists or not
        const getLatestHistoryQuery = this.esQueries.getLatestHistory(hash);
        const index = this.configService.get("ES_INDEX")
        const lastHistoryResp = await this.esService.queryIndexByDSL(getLatestHistoryQuery, index)
        const lastHistoryData = lastHistoryResp.body.hits.hits
        let changes = {}
        let version = 1
        let eventType = TYPE.CREATED
        if (lastHistoryData.length > 0) {
            console.log("Updating History")
            eventType = TYPE.UPDATED
            version = lastHistoryData[0]._source.version + 1
            changes = await this.getChanges(payload, lastHistoryData[0]._source.body)

            if (!changes) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: "No changes detected."
                }
            }
            // return await this.addObjectToTrace(payload, user, hash, lastHistoryData[0], index)
        } else {
            console.log("Creating new Record")
            changes = {}
            eventType = TYPE.CREATED
        }
        const timestamp = new Date()
        const obj = {
            key: hash,
            timestamp: timestamp,
            version: version,
            body: payload,
            changes: changes,
            user: user,
            type: eventType
        }

        await this.esService.write(obj, index)
        return {
            status: HttpStatus.CREATED,
            changes
        }
    }

    async getChanges(currentPayload, previousPayload) {
        try {
            const diff = jsonDiff.diff(previousPayload, currentPayload)
            console.log(diff)
            return diff
        } catch (err) {
            console.log(err)
            throw new InternalServerErrorException(err.message)

        }
    }

    /**
     * 
     * @param entities Input parameter to identify
     * @returns 
     */
    async getHistory(entities: Array<EntityDTO>) {
        const hash = this.encrypt(entities)

        const getFullHistoryQuery = this.esQueries.getFullHistory(hash);
        const index = this.configService.get("ES_INDEX")
        const fullHistoryResp = await this.esService.queryIndexByDSL(getFullHistoryQuery, index)
        const fullHistoryData = fullHistoryResp.body.hits.hits
        const res = fullHistoryData.map(d => {
            return {
                timestamp: d._source.timestamp,
                version: d._source.version,
                changes: d._source.changes,
                user: d._source.user,
                type: d._source.type
            }
        })
        return res

    }
}
