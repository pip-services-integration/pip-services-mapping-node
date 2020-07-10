"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_data_node_1 = require("pip-services3-data-node");
const MappingV1_1 = require("../data/version1/MappingV1");
class MappingsMemoryPersistence extends pip_services3_data_node_1.IdentifiableMemoryPersistence {
    constructor() {
        super();
        this._defaultTTL = 7 * 24 * 60 * 60 * 1000;
    }
    getCollectionNames(correlationId, callback) {
        var result = new Array();
        for (var mapping of this._items) {
            var collection = mapping.collection;
            if (result.indexOf(collection) < 0)
                result.push(collection);
        }
        callback(null, result);
    }
    createFromParams(correlationId, collection, internalId, externalId, timeToLive, callback) {
        var mapping;
        timeToLive = timeToLive > 0 ? timeToLive : this._defaultTTL;
        mapping = new MappingV1_1.MappingV1(collection, internalId, externalId, new Date(Date.now() + timeToLive));
        super.create(correlationId, mapping, callback);
    }
    getByInternalId(correlationId, collection, internalId, callback) {
        var result = null;
        var items = _.filter(this._items, (m) => {
            return collection.localeCompare(m.collection) == 0 && internalId.localeCompare(m.internal_id) == 0;
        });
        var mapping = items.length > 0 ? items[0] : null;
        result = mapping != null && mapping.expiration_time > new Date() ? mapping.external_id : null;
        callback(null, result);
    }
    getByExternalId(correlationId, collection, externalId, callback) {
        var result = null;
        var items = _.filter(this._items, (m) => {
            return collection.localeCompare(m.collection) == 0 && externalId.localeCompare(m.external_id) == 0;
        });
        var mapping = items.length > 0 ? items[0] : null;
        result = mapping != null && mapping.expiration_time > new Date() ? mapping.internal_id : null;
        callback(null, result);
    }
    delete(correlationId, collection, internalId, externalId, callback) {
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
    deleteExpired(correlationId, callback) {
        var now = new Date();
        for (var index = this._items.length - 1; index >= 0; index--) {
            if (this._items[index].expiration_time <= now) {
                this._items.splice(index, 1);
            }
        }
        callback(null);
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        var collection = filter.getAsNullableString("collection");
        var id = filter.getAsNullableString("id");
        var internalId = filter.getAsNullableString("internal_id");
        var externalId = filter.getAsNullableString("external_id");
        var search = filter.getAsNullableString("search");
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
}
exports.MappingsMemoryPersistence = MappingsMemoryPersistence;
//# sourceMappingURL=MappingsMemoryPersistence.js.map