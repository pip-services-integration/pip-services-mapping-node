const _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';

import { MappingV1 } from '../data/version1/MappingV1';
import { IMappingsPersistence } from './IMappingsPersistence';

export class MappingsMemoryPersistence
    extends IdentifiableMemoryPersistence<MappingV1, string>
    implements IMappingsPersistence {

    private readonly _defaultTTL: number = 7 * 24 * 60 * 60 * 1000;

    constructor() {
        super();
    }

    public getCollectionNames(correlationId: string, callback: (err: any, items: string[]) => void): void {
        let result: string[] = [];
        for (let mapping of this._items) {
            let collection = mapping.collection;
            if (result.indexOf(collection) < 0)
                result.push(collection);
        }
        callback(null, result);
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();
        let collection = filter.getAsNullableString("collection");
        let id = filter.getAsNullableString("id");
        let internalId = filter.getAsNullableString("internal_id");
        let externalId = filter.getAsNullableString("external_id");
        let search = filter.getAsNullableString("search");

        return (item: MappingV1) => {
            if (collection != null && item.collection != collection)
                return false;
            if (id != null && item.external_id != id && item.internal_id != id)
                return false;
            if (internalId != null && item.internal_id != internalId)
                return false;
            if (externalId != null && item.external_id != externalId)
                return false;
            if (search != null && item.external_id != search && item.internal_id != search)
                return false;
            return true;
        };
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<MappingV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    public createFromParams(correlationId: string, collection: string, internalId: string, externalId: string, timeToLive: number,
        callback: (err: any, item: MappingV1) => void): void {
        let mapping: MappingV1;
        timeToLive = timeToLive > 0 ? timeToLive : this._defaultTTL;
        mapping = <MappingV1>{
            collection: collection,
            internal_id: internalId,
            external_id: externalId,
            expiration_time: new Date(new Date().getTime() + timeToLive)
        };

        super.create(correlationId, mapping, callback);
    }

    public getByInternalId(correlationId: string, collection: string, internalId: string,
        callback: (err: any, externalId: string) => void): void {
        let result: string = null;

        let items = _.filter(this._items, (m) => {
            return collection.localeCompare(m.collection) == 0 && internalId.localeCompare(m.internal_id) == 0
        });
        let mapping: MappingV1 = items.length > 0 ? items[0] : null;
        result = mapping != null && mapping.expiration_time > new Date() ? mapping.external_id : null;
        callback(null, result);
    }

    public getByExternalId(correlationId: string, collection: string, externalId: string, callback: (err: any, internalId: string) => void): void {
        let result: string = null;
        let items = _.filter(this._items, (m) => {
            return collection.localeCompare(m.collection) == 0 && externalId.localeCompare(m.external_id) == 0
        });
        let mapping: MappingV1 = items.length > 0 ? items[0] : null;
        result = mapping != null && mapping.expiration_time > new Date() ? mapping.internal_id : null;
        callback(null, result);
    }

    public delete(correlationId: string, collection: string, internalId: string, externalId: string,
        callback: (err: any) => void): void {
        for (let index = this._items.length - 1; index >= 0; index--) {
            let mapping = this._items[index];
            if (mapping.collection == collection
                && mapping.internal_id == internalId
                && mapping.external_id == externalId) {
                this._items.splice(index, 1);
                break;
            }
        }

        callback(null);
    }

    public deleteExpired(correlationId: string, callback: (err: any) => void): void {
        let now = new Date().getTime();
        for (let index = this._items.length - 1; index >= 0; index--) {
            if (this._items[index].expiration_time.getTime() <= now) {
                this._items.splice(index, 1);
            }
        }
        callback(null);
    }

}

