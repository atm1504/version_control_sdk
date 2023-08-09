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


}
