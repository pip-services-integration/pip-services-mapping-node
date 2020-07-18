"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_data_node_1 = require("pip-services3-data-node");
class MappingsMemoryPersistence extends pip_services3_data_node_1.IdentifiableMemoryPersistence {
    constructor() {
        super();
        this._defaultTTL = 7 * 24 * 60 * 60 * 1000;
    }
    getCollectionNames(correlationId, callback) {
        let result = [];
        for (let mapping of this._items) {
            let collection = mapping.collection;
            if (result.indexOf(collection) < 0)
                result.push(collection);
        }
        callback(null, result);
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let collection = filter.getAsNullableString("collection");
        let id = filter.getAsNullableString("id");
        let internalId = filter.getAsNullableString("internal_id");
        let externalId = filter.getAsNullableString("external_id");
        let search = filter.getAsNullableString("search");
        return (item) => {
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
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
    createFromParams(correlationId, collection, internalId, externalId, timeToLive, callback) {
        let mapping;
        timeToLive = timeToLive > 0 ? timeToLive : this._defaultTTL;
        mapping = {
            collection: collection,
            internal_id: internalId,
            external_id: externalId,
            expiration_time: new Date(new Date().getTime() + timeToLive)
        };
        super.create(correlationId, mapping, callback);
    }
    getByInternalId(correlationId, collection, internalId, callback) {
        let result = null;
        let items = _.filter(this._items, (m) => {
            return collection.localeCompare(m.collection) == 0 && internalId.localeCompare(m.internal_id) == 0;
        });
        let mapping = items.length > 0 ? items[0] : null;
        result = mapping != null && mapping.expiration_time > new Date() ? mapping.external_id : null;
        callback(null, result);
    }
    getByExternalId(correlationId, collection, externalId, callback) {
        let result = null;
        let items = _.filter(this._items, (m) => {
            return collection.localeCompare(m.collection) == 0 && externalId.localeCompare(m.external_id) == 0;
        });
        let mapping = items.length > 0 ? items[0] : null;
        result = mapping != null && mapping.expiration_time > new Date() ? mapping.internal_id : null;
        callback(null, result);
    }
    delete(correlationId, collection, internalId, externalId, callback) {
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
    deleteExpired(correlationId, callback) {
        let now = new Date().getTime();
        for (let index = this._items.length - 1; index >= 0; index--) {
            if (this._items[index].expiration_time.getTime() <= now) {
                this._items.splice(index, 1);
            }
        }
        callback(null);
    }
}
exports.MappingsMemoryPersistence = MappingsMemoryPersistence;
//# sourceMappingURL=MappingsMemoryPersistence.js.map