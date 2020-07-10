let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { IMappingsPersistence } from '../../src/persistence/IMappingsPersistence';

export class MappingsPersistenceFixture {
    private _persistence: IMappingsPersistence;

    constructor(persistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    testGetMappingCollections(done) {
        // Add mappings
        async.series([
            // create one Mapping
            (callback) => {
                this._persistence.createFromParams(null, "Common.Collection", "123", "789", 60 * 1000, callback);
            },
            (callback) => {
                this._persistence.createFromParams(null, "Common.AnotherCollection", "123", "543", 60 * 1000, callback);
            },
            (callback) => {
                this._persistence.createFromParams(null, "Common.Collection", "ABC", "XYZ", 60 * 1000, callback);
            },
            (callback) => {

                this._persistence.getCollectionNames(null, (err, items) => {
                    assert.isNull(err);
                    assert.equal(2, items.length);
                    assert.include(items, "Common.Collection");
                    assert.include(items, "Common.AnotherCollection");
                    callback();
                });

            }], done);
    }

    public testGetMappings(done) {

        async.series([
            (callback) => {
                // Add mappings
                this._persistence.createFromParams(null, "Common.Collection", "123", "789", 60 * 1000, callback);
            },
            (callback) => {
                this._persistence.createFromParams(null, "Common.AnotherCollection", "123", "543", 60 * 1000, callback);
            },
            (callback) => {
                this._persistence.createFromParams(null, "Common.Collection", "ABC", "XYZ", 60 * 1000, callback);
            }, (callback) => {
                this._persistence.createFromParams(null, "Common.Collection", "AAA", "111", 60 * 1000, callback);
            },
            (callback) => {
                this._persistence.getPageByFilter(null, FilterParams.fromTuples("collection", "Common.Collection"), new PagingParams(1, 10, false), (err, page) => {
                    assert.isNull(err);
                    assert.isNotNull(page.data);
                    assert.equal(2, page.data.length); 
                    callback();
                });

            }], done);
    }


    public testMapping(done) {

        async.series([
            // Add mappings
            (callback) => {
                this._persistence.createFromParams(null, "Common.Collection", "123", "789", 60 * 1000, callback);
            }, (callback) => {
                this._persistence.createFromParams(null, "Common.AnotherCollection", "123", "543", 60 * 1000, callback);
            }, (callback) => {
                this._persistence.createFromParams(null, "Common.Collection", "ABC", "XYZ", 60 * 1000, callback);
            }, (callback) => {

                // Test internal mappings
                this._persistence.getByInternalId(null, "Common.Collection", "123", (err, id) => {
                    assert.isNull(err);
                    assert.equal("789", id);
                    callback();
                });

            }, (callback) => {

                // Test external mappings
                this._persistence.getByExternalId(null, "Common.Collection", "789", (err, id) => {
                    assert.isNull(err);
                    assert.equal("123", id);
                    callback();
                });

            }, (callback) => {
                // Test different collection
                this._persistence.getByInternalId(null, "Common.AnotherCollection", "123", (err, id) => {
                    assert.isNull(err);
                    assert.equal("543", id);
                    callback();
                });

            }, (callback) => {

                // Test non-exiting collection
                this._persistence.getByInternalId(null, "Common.YetAnotherCollection", "123", (err, id) => {
                    assert.isNull(err);
                    assert.isNull(id);
                    callback();
                });

            }, (callback) => {

                // Test non-exiting mapping
                this._persistence.getByInternalId(null, "Common.Collection", "555", (err, id) => {
                    assert.isNull(err);
                    assert.isNull(id);
                    callback();
                });

            }, (callback) => {

                // Delete mapping
                this._persistence.delete(null, "Common.Collection", "123", "789", (err) => {
                    assert.isNull(err);
                    this._persistence.getByInternalId(null, "Common.Collection", "123", (e, id) => {
                        assert.isNull(e);
                        assert.isNull(id);
                        callback();
                    });

                });

            }], done);
    }

    public testExpiredMappings(done) {
        async.series([
            (callback) => {
                // Add mappings
                this._persistence.createFromParams(null, "Common.Collection", "123", "789", 100, callback);
            }, (callback) => {
                this._persistence.createFromParams(null, "Common.Collection", "ABC", "XYZ", 100, callback);
            }, (callback) => {
                // Wait to expire
                setTimeout(() => {
                    this._persistence.deleteExpired(null, callback);
                }, 500);

            }, (callback) => {
                // Try to read expired mappings
                this._persistence.getByInternalId(null, "Common.Collection", "123", (err, id) => {
                    assert.isNull(err);
                    assert.isNull(id);
                    callback();
                });

            }, (callback) => {
                this._persistence.getByInternalId(null, "Common.Collection", "ABC", (err, id) => {
                    assert.isNull(err);
                    assert.isNull(id);
                    callback();
                });

            }], done);
    }

}
