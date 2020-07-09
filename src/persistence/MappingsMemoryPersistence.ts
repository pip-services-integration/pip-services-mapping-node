let _ = require('lodash');

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

    getCollectionNames(correlationId: string, callback: (err: any, items: string[]) => void): void {
        var result = new Array<string>();
        for (var mapping of this._items) {
            var collection = mapping.collection;
            if (result.indexOf(collection) < 0)
                result.push(collection);
        }
        callback(null, result);
    }


    createFromParams(correlationId: string, collection: string, internalId: string, externalId: string, timeToLive: number, callback: (err: any, item: MappingV1) => void): void {
        var mapping: MappingV1;
        timeToLive = timeToLive > 0 ? timeToLive : this._defaultTTL;
        mapping = new MappingV1
            (
                collection,
                externalId,
                internalId,
                new Date(Date.now() + timeToLive)
            );

        super.create(correlationId, mapping, callback);
    }


    getByInternalId(correlationId: string, collection: string, internalId: string, callback: (err: any, externalId: string) => void): void {
        var result: string = null;
        var items = this._items.filter((m) => { m.collection == collection && m.internal_id == internalId });
        var mapping: MappingV1 = items.length > 0 ? items[0] : null;
        result = mapping != null && mapping.expiration_time > new Date() ? mapping.external_id : null;
        callback(null, result);
    }


    getByExternalId(correlationId: string, collection: string, externalId: string, callback: (err: any, internalId: string) => void): void {
        var result: string = null;
        var items = this._items.filter((m) => { m.collection == collection && m.external_id == externalId });
        var mapping: MappingV1 = items.length > 0 ? items[0] : null;
        result = mapping != null && mapping.expiration_time > new Date() ? mapping.internal_id : null;
        callback(null, result);
    }

    delete(correlationId: string, collection: string, internalId: string, externalId: string, callback: (err: any) => void): void {

        for (var index = this._items.length - 1; index >= 0; index--) {
            var mapping = this._items[index];
            if (mapping.collection == collection
                && mapping.internal_id == internalId
                && mapping.external_id == externalId) {
                this._items.splice(index, 1);
                break;
            }
        }

        callback(null);
    }

    deleteExpired(correlationId: string, callback: (err: any) => void): void {
        var now: Date = new Date();
        for (var index = this._items.length - 1; index >= 0; index--) {
            if (this._items[index].expiration_time <= now) {
                this._items.splice(index, 1);
            }
        }
        callback(null);
    }

    private composeFilter(filter: FilterParams): any {

        filter = filter || new FilterParams();
        var collection = filter.getAsNullableString("collection");
        var id = filter.getAsNullableString("id");
        var internalId = filter.getAsNullableString("internal_id");
        var externalId = filter.getAsNullableString("external_id");
        var search = filter.getAsNullableString("search");

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

}

