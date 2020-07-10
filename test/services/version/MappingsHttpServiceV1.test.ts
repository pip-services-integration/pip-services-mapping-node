let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams, PagingParams, FilterParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { MappingV1 } from '../../../src/data/version1/MappingV1';
import { MappingsMemoryPersistence } from '../../../src/persistence/MappingsMemoryPersistence';
import { MappingsController } from '../../../src/logic/MappingsController';
import { MappingsHttpServiceV1 } from '../../../src/services/version1/MappingsHttpServiceV1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);


suite('MappingsHttpServiceV1', () => {
    let service: MappingsHttpServiceV1;
    let rest: any;

    suiteSetup((done) => {
        let persistence = new MappingsMemoryPersistence();
        let controller = new MappingsController();

        service = new MappingsHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services-mappings', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-mappings', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-mappings', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        service.open(null, done);
    });

    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });


    test('Test Mapping', (done) => {
        let mapping1, mapping2: MappingV1;

        async.series([
            // Create one Mapping
            (callback) => {
                rest.post('/v1/mappings/add_mapping',
                    { collection: "Common.Collection1", internal_id: "123", external_id: "789", ttl: 60000 },
                    (err, req, res, mapping) => {
                        assert.isNull(err);
                        assert.isObject(mapping);
                        callback();
                    });
            }, (callback) => {
                rest.post('/v1/mappings/add_mapping',
                    { collection: "Common.AnotherCollection1", internal_id: "123", external_id: "543", ttl: 60000 },
                    (err, req, res, mapping) => {
                        assert.isNull(err);
                        assert.isObject(mapping);
                        callback();
                    });
            }, (callback) => {
                rest.post('/v1/mappings/add_mapping',
                    { collection: "Common.Collection1", internal_id: "ABC", external_id: "XYZ", ttl: 60000 },
                    (err, req, res, mapping) => {
                        assert.isNull(err);
                        assert.isObject(mapping);
                        callback();
                    });

            }, (callback) => {
                rest.post('/v1/mappings/get_collection_names',
                    {},
                    (err, req, res, collections) => {
                        assert.isNull(err);
                        assert.isNotNull(collections);
                        assert.equal(2, collections.length);
                        assert.include(collections, "Common.Collection1");
                        assert.include(collections, "Common.AnotherCollection1");
                        callback();
                    });

            }, (callback) => {
                // Add mappings
                rest.post('/v1/mappings/add_mapping',
                    { collection: "Common.Collection2", internal_id: "123", external_id: "789", ttl: 60000 },
                    (err, req, res, mapping) => {
                        assert.isNull(err);
                        assert.isObject(mapping);
                        callback();
                    });

            }, (callback) => {
                rest.post('/v1/mappings/add_mapping',
                    { collection: "Common.AnotherCollection2", internal_id: "123", external_id: "543", ttl: 60000 },
                    (err, req, res, mapping) => {
                        assert.isNull(err);
                        assert.isObject(mapping);
                        callback();
                    });

            }, (callback) => {
                rest.post('/v1/mappings/add_mapping',
                    { collection: "Common.Collection2", internal_id: "ABC", external_id: "XYZ", ttl: 60000 },
                    (err, req, res, mapping) => {
                        assert.isNull(err);
                        assert.isObject(mapping);
                        callback();
                    });

            }, (callback) => {
                rest.post('/v1/mappings/add_mapping',
                    { collection: "Common.Collection2", internal_id: "AAA", external_id: "111", ttl: 60000 },
                    (err, req, res, mapping) => {
                        assert.isNull(err);
                        assert.isObject(mapping);
                        callback();
                    });

            }, (callback) => {
                rest.post('/v1/mappings/get_mappings',
                    { filter: FilterParams.fromTuples("collection", "Common.Collection2"), paging: new PagingParams(1, 10, false) },
                    (err, req, res, mappings) => {
                        assert.isNull(err);
                        assert.isNotNull(mappings);
                        assert.isNotNull(mappings.data);
                        assert.equal(2, mappings.data.length);
                        callback();
                    });
            }, (callback) => {
                // Add mappings
                rest.post('/v1/mappings/add_mapping',
                    { collection: "Common.Collection", internal_id: "123", external_id: "789", ttl: 60000 },
                    (err, req, res, mapping) => {
                        assert.isNull(err);
                        assert.isObject(mapping);
                        callback();
                    });
            }, (callback) => {
                rest.post('/v1/mappings/add_mapping',
                    { collection: "Common.AnotherCollection", internal_id: "123", external_id: "543", ttl: 60000 },
                    (err, req, res, mapping) => {
                        assert.isNull(err);
                        assert.isObject(mapping);
                        callback();
                    });
            }, (callback) => {
                rest.post('/v1/mappings/add_mapping',
                    { collection: "Common.Collection", internal_id: "ABC", external_id: "XYZ", ttl: 60000 },
                    (err, req, res, mapping) => {
                        assert.isNull(err);
                        assert.isObject(mapping);
                        callback();
                    });

            }, (callback) => {
                // Test internal mappings
                rest.post('/v1/mappings/map_to_external',
                    { collection: "Common.Collection", internal_id: "123" },
                    (err, req, res, id) => {
                        assert.isNull(err);
                        assert.equal("789", id);
                        callback();
                    });

            }, (callback) => {
                // Test external mappings
                rest.post('/v1/mappings/map_to_internal',
                    { collection: "Common.Collection", external_id: "789" },
                    (err, req, res, id) => {
                        assert.isNull(err);
                        assert.equal("123", id);
                        callback();
                    });

            }, (callback) => {
                // Test different collection
                rest.post('/v1/mappings/map_to_external',
                    { collection: "Common.AnotherCollection", internal_id: "123" },
                    (err, req, res, id) => {
                        assert.isNull(err);
                        assert.equal("543", id);
                        callback();
                    });

            }, (callback) => {
                // Test non-exiting collection
                rest.post('/v1/mappings/map_to_external',
                    { collection: "Common.YetAnotherCollection", internal_id: "123" },
                    (err, req, res, id) => {
                        assert.isNull(err);
                        assert.isEmpty(id);
                        callback();
                    });

            }, (callback) => {
                // Test non-exiting mapping
                rest.post('/v1/mappings/map_to_external',
                    { collection: "Common.Collection", internal_id: "555" },
                    (err, req, res, id) => {
                        assert.isNull(err);
                        assert.isEmpty(id);
                        callback();
                    });
            }

        ], done);
    });
});


