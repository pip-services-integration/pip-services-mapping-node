
let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { MappingsMemoryPersistence } from "../../src/persistence/MappingsMemoryPersistence";
import { ConfigParams, Descriptor, References, FilterParams, PagingParams } from "pip-services3-commons-node";
import { MappingsController } from "../../src/logic/MappingsController";

suite('Mappings Controller', () => {
    let _persistence: MappingsMemoryPersistence;
    let _controller: MappingsController;

    setup((done) => {
        _persistence = new MappingsMemoryPersistence();
        _controller = new MappingsController();
        _persistence.configure(new ConfigParams());
        var references = References.fromTuples(
            new Descriptor("pip-services-mappings", "persistence", "mock", "default", "1.0"), _persistence
        );
        _controller.setReferences(references);
        _persistence.open(null, done);
    });

    teardown((done) => {
        _persistence.close(null, done);
    });

    test('Test Get Mapping Collections', (done) => {
        async.series([
            // Add mappings
            (callback) => {
                _controller.addMapping(null, "Common.Collection", "123", "789", 60 * 1000, callback);
            }, (callback) => {
                _controller.addMapping(null, "Common.AnotherCollection", "123", "543", 60 * 1000, callback);
            }, (callback) => {
                _controller.addMapping(null, "Common.Collection", "ABC", "XYZ", 60 * 1000, callback);
            }, (callback) => {

                _controller.getCollectionNames(null, (err, items) => {
                    assert.isNull(err);
                    assert.equal(2, items.length);
                    assert.include(items, "Common.Collection");
                    assert.include(items, "Common.AnotherCollection");
                    callback();
                });

            }], done);
    });


    test('Test Get Mappings', (done) => {

        async.series([// Add mappings
            (callback) => {
                _controller.addMapping(null, "Common.Collection", "123", "789", 60 * 1000, callback);
            }, (callback) => {
                _controller.addMapping(null, "Common.AnotherCollection", "123", "543", 60 * 1000, callback);
            }, (callback) => {
                _controller.addMapping(null, "Common.Collection", "ABC", "XYZ", 60 * 1000, callback);
            }, (callback) => {
                _controller.addMapping(null, "Common.Collection", "AAA", "111", 60 * 1000, callback);
            }, (callback) => {
                _controller.getMappings(null, FilterParams.fromTuples("collection", "Common.Collection"), new PagingParams(1, 10, false), (err, mappings) => {
                    assert.isNull(err);
                    assert.isNotNull(mappings.data);
                    assert.equal(2, mappings.data.length);
                    callback();
                });

            }], done);
    });


    test('TestMapping', (done) => {

        async.series([
            // Add mappings
            (callback) => {
                _controller.addMapping(null, "Common.Collection", "123", "789", 60 * 1000, callback);
            }, (callback) => {
                _controller.addMapping(null, "Common.AnotherCollection", "123", "543", 60 * 1000, callback);
            }, (callback) => {
                _controller.addMapping(null, "Common.Collection", "ABC", "XYZ", 60 * 1000, callback);
            }, (callback) => {

                // Test internal mappings
                _controller.mapToExternal(null, "Common.Collection", "123", (err, id) => {
                    assert.isNull(err);
                    assert.equal("789", id);
                    callback();
                });

            }, (callback) => {
                // Test external mappings
                _controller.mapToInternal(null, "Common.Collection", "789", (err, id) => {
                    assert.isNull(err);
                    assert.equal("123", id);
                    callback();
                });

            }, (callback) => {
                // Test different collection
                _controller.mapToExternal(null, "Common.AnotherCollection", "123", (err, id) => {
                    assert.isNull(err);
                    assert.equal("543", id);
                    callback();
                });

            }, (callback) => {
                // Test non-exiting collection
                _controller.mapToExternal(null, "Common.YetAnotherCollection", "123", (err, id) => {
                    assert.isNull(err);
                    assert.isNull(id);
                    callback();
                });

            }, (callback) => {
                // Test non-exiting mapping
                _controller.mapToExternal(null, "Common.Collection", "555", (err, id) => {
                    assert.isNull(err);
                    assert.isNull(id);
                    callback();
                });

            }], done);
    });


    test('Test Expired Mappings', (done) => {

        async.series([
            // Add mappings
            (callback) => {
                _controller.addMapping(null, "Common.Collection", "123", "789", 100, callback);
            }, (callback) => {
                _controller.addMapping(null, "Common.Collection", "ABC", "XYZ", 100, callback);
            }, (callback) => {

                // Wait to expire
                setTimeout(() => {
                    _controller.deleteExpiredMappings(null, callback);
                }, 500);

            }, (callback) => {
                // Try to read expired mappings
                _controller.mapToExternal(null, "Common.Collection", "123", (err, id) => {
                    assert.isNull(err);
                    assert.isNull(id);
                    callback();
                });

            }, (callback) => {
                _controller.mapToExternal(null, "Common.Collection", "ABC", (err, id) => {
                    assert.isNull(err);
                    assert.isNull(id);
                    callback();
                });

            }], done);
    });

});