let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';

import { MappingV1 } from '../data/version1/MappingV1';
import { IMappingsPersistence } from './IMappingsPersistence';

export class MappingsMongoDbPersistence
    extends IdentifiableMongoDbPersistence<MappingV1, string>
    implements IMappingsPersistence {

    private readonly _defaultTTL: number = 7 * 24 * 60 * 60 * 1000;

    constructor() {
        super('mappings');
    }

    private composeFilter(filter: any) {
        filter = filter || new FilterParams();

        let criteria = [];
        let collection = filter.getAsNullableString("collection");
        let id = filter.getAsNullableString("id");
        let internalId = filter.getAsNullableString("internal_id");
        let externalId = filter.getAsNullableString("external_id");
        let search = filter.getAsNullableString("search");

        if (id != null) {
            let searchFilter = [];
            searchFilter.push({ external_id: id });
            searchFilter.push({ internal_id: id });
            criteria.push({ $or: searchFilter });
        }

        if (collection != null)
            criteria.push({ collection: collection });
        if (internalId != null)
            criteria.push({ internal_id: internalId });
        if (externalId != null)
            criteria.push({ external_id: externalId });
        if (search != null) {
            var searchFilter = [];
            searchFilter.push({ external_id: search });
            searchFilter.push({ internal_id: search });
            criteria.push({ $or: searchFilter });
        }

        return criteria.length > 0 ? { $and: criteria } : null;
    }

    private makeId(collection: string, internalId: string, externalId: string): string {
        return collection + "_" + internalId + "_" + externalId;
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<MappingV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    public createFromParams(correlationId: string, collection: string, internalId: string, externalId: string, ttl: number,
        callback: (err: any, item: MappingV1) => void): void {

        ttl = ttl > 0 ? ttl : this._defaultTTL;

        let mapping = <MappingV1>{
            id: this.makeId(collection, internalId, externalId),
            collection: collection,
            internal_id: internalId,
            external_id: externalId,
            expiration_time: new Date(new Date().getTime() + ttl)
        };
        super.set(correlationId, mapping, callback);
    }

    public getCollectionNames(correlationId: string,
        callback: (err: any, items: string[]) => void): void {
        this._collection.aggregate([
            {
                "$group": { _id: "$collection", count: { $sum: 1 } }
            }
        ]).toArray((err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            let items: string[] = [];
            for (let item of results) {
                items.push(item._id);
            }
            callback(null, items);
        })
    }

    public getByInternalId(correlationId: string, collection: string, internalId: string,
        callback: (err: any, externalId: string) => void): void {
        let filter = {
            collection: collection,
            internal_id: internalId
        };

        super.getListByFilter(correlationId, filter, null, null, (err, items) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, items.length > 0 ? items[0].external_id : null);
        })
    }

    public getByExternalId(correlationId: string, collection: string, externalId: string,
        callback: (err: any, internalId: string) => void): void {
        let filter = {
            collection: collection,
            external_id: externalId
        };

        super.getListByFilter(correlationId, filter, null, null, (err, items) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, items.length > 0 ? items[0].internal_id : null);
        })
    }

    public delete(correlationId: string, collection: string, internalId: string, externalId: string,
        callback: (err: any) => void): void {
        let id = this.makeId(collection, internalId, externalId);
        super.deleteById(correlationId, id, callback);
    }

    public deleteExpired(correlationId: string, callback: (err: any) => void): void {
        let now = new Date();
        let filter = { expiration_time: { $lte: now } };
        super.deleteByFilter(correlationId, filter, callback);
    }
}
