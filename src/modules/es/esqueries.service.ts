import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';

import { EsService } from 'src/services/elasticsearch/elasticsearch.service';

@Injectable()
export class EsQueriesService {

  constructor(
    private config: ConfigService,
    private esService: EsService
  ) { }

  /**
   * DSL query to get the latest history of the hash
   * @param hash 
   * @returns the latest history associated with this hash if present
   */
  getLatestHistory(hash: string) {
    return {
      "query": {
        "term": {
          "key.keyword": hash
        }
      },
      "size": 1,
      "sort": [
        { "timestamp": "desc" }
      ]
    }
  }

  /**
   * DSL query to the full history for the input hash
   * @param hash 
   * @returns 
   */
  getFullHistory(hash: string) {
    return {
      "query": {
        "term": {
          "key.keyword": hash
        }
      },
      "sort": [
        { "timestamp": "desc" }
      ]
    }
  }

  /**
   * DSL query to get the history of a hash at a particular version
   * @param hash 
   * @param version 
   * @returns 
   */
  getHistoryAtVersion(hash: string, version: number) {
    return {
      "query": {
        "bool": {
          "must": [
            { "term": { "key.keyword": hash } },
            { "term": { "version": version } }
          ]
        }
      },
      "size": 1,
      "sort": [
        { "timestamp": "desc" }
      ]
    }
  }
}
