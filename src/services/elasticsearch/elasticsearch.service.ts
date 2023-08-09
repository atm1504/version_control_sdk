import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';
@Injectable()
export class EsService {
  constructor(
    private readonly elasticSearchService: ElasticsearchService,
    private readonly configService: ConfigService,
  ) { }

  async scroll(id) {
    return this.elasticSearchService.scroll({
      scroll_id: id,
      scroll: '30s'
    })
  }

  async queryIndexByDSL(queryString, index, size?, from?) {
    let pathUrl = `${index}/_search`;
    if (size && from) {
      pathUrl += `?size=${size}&from=${from}`;
    } else if (size) {
      pathUrl += `?size=${size}`;
    }
    const response = await this.elasticSearchService.transport.request(
      {
        method: 'POST',
        path: pathUrl,
        body: queryString,
      },
      {
        ignore: [404],
      },
    );
    return response;
  }

  async countQueryDSL(queryString, index) {
    return await this.elasticSearchService.transport.request(
      {
        method: 'POST',
        path: `${index}/_count`,
        body: queryString,
      },
      {
        ignore: [404],
      },
    );
  }

  async bulk(payload, index) {
    const bodyObj = payload.flatMap((doc) => [
      { index: { _index: index } },
      doc,
    ]);
    return await this.elasticSearchService.bulk({
      body: bodyObj,
      index: index,
      type: '_doc',
    });
  }

  async bultESInsertion(payload: any, index: any) {
    const obj = [];
    let updateLst = [];
    const chunkedPayload = _.chunk(payload, 10000);
    for (const value of chunkedPayload) {
      Logger.log(value.length);
      value.map((doc) => {
        obj.push({
          create: { _index: index }
        })
        obj.push({ ...doc })
      });

      const resp = await this.elasticSearchService.bulk({
        body: obj,
        refresh: true
      });

      let tempLst = _.filter(resp.body.items, function (data) {
        return data.create.status != 201;
      });
      updateLst.push(...tempLst);
    }
    updateLst = _.map(updateLst, 'create._id');
    return updateLst;
  }

  async search(query, index) {
    return this.elasticSearchService.search({
      index: index,
      size: 5000,
      body: query,
      scroll: '30s'
    });
  }

  countQuery(query, index) {
    return this.elasticSearchService.count({
      index: index,
      body: query
    });
  }


  async write(doc, index) {
    return this.elasticSearchService.index({
      index: index,
      type: '_doc',
      body: doc,
    });
  }

  async update(id, doc, index) {
    return this.elasticSearchService.update({
      index: index,
      id: id,
      type: '_doc',
      body: {
        doc: doc,
      },
    });
  }

  async updateByQuery(doc, index) {
    return this.elasticSearchService.updateByQuery({
      index: index,
      type: '_doc',
      body: doc,
    });
  }

  async updateAllByQuery(index, traitLst) {
    try {
      const doc = {
        script: {
          source: traitLst.reduce((prev, curr) => {
            return prev + `ctx._source.${curr} = null;`
          }, ""),
        },
      }
      return await this.elasticSearchService.updateByQuery({
        index: index,
        body: doc,
      });
    } catch (err) {
      return err
    }
  }
  async bulktraitCreation(payload: any, index: any) {
    const obj = [];
    let updateLst = [];
    const chunkedPayload = _.chunk(payload, 10000);
    for (const value of chunkedPayload) {
      Logger.log(value.length);
      value.map((doc) => {
        obj.push({
          create: { _index: index, _id: doc.UserId }
        })
        obj.push({ ...doc })
      });

      const resp = await this.elasticSearchService.bulk({
        body: obj,
        refresh: true
      });
      let tempLst = _.filter(resp.body.items, function (data) {
        return data.create.status != 201;
      });
      updateLst.push(...tempLst);
    }
    updateLst = _.map(updateLst, 'create._id');
    return updateLst;
  }


  async bulktraitUpdate(payload: any, accId, index: any) {
    try {
      const obj = []
      let resp = [];
      const chunkedPayload = _.chunk(payload, 10000);
      for (const value of chunkedPayload) {
        Logger.log(value.length);
        value.forEach((doc) => {
          obj.push({
            update: { _index: index, _id: doc.UserId, retry_on_conflict: 3 }
          })
          obj.push({
            "doc": {
              traits: { ...doc },
              cdmpAccountId: accId
            }, "doc_as_upsert": true
          })
        });
        const res = await this.elasticSearchService.bulk({
          body: obj,
          refresh: true
        });
        resp.push(res);
      }
      return resp;
    }
    catch (err) {
      return err;
    }
  }

  async ESSearchExport(query, index) {
    let resp = await this.search(query, index)

    const res = []
    let scrollId;
    // while(resp && resp["body"] && resp["body"]["hits"] && resp["body"]["hits"]["hits"] && resp["body"]["_scroll_id"] && !_.isEmpty(resp["body"]["hits"]["hits"])){
    while (resp.body?.hits?.hits && !_.isEmpty(resp.body.hits.hits)) {
      if (resp && resp["body"] && resp["body"]["hits"] && resp["body"]["hits"]["hits"] && resp["body"]["_scroll_id"]) {
        scrollId = resp["body"]["_scroll_id"]
        res.push(...resp["body"]["hits"]["hits"])
      }
      resp = await this.scroll(scrollId)
    }
    return res;
  }

  async esFieldMapping(index, field) {
    const result = await this.elasticSearchService.indices.getFieldMapping({ index: index, fields: field })
    return result;
  }
}
