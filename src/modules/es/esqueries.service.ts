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
   * 
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

    }
    // "sort": [
    //   { "timestamp": "desc" }
    // ]
  }
}
