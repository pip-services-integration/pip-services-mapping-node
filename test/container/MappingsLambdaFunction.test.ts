// let _ = require('lodash');
// let async = require('async');
// let assert = require('chai').assert;

// import { Descriptor } from 'pip-services3-commons-node';
// import { ConfigParams } from 'pip-services3-commons-node';
// import { References } from 'pip-services3-commons-node';
// import { ConsoleLogger } from 'pip-services3-components-node';

// import { MappingV1 } from '../../src/data/version1/MappingV1';
// import { MappingTypeV1 } from '../../src/data/version1/MappingTypeV1';
// import { MappingStateV1 } from '../../src/data/version1/MappingStateV1';
// import { MappingsMemoryPersistence } from '../../src/persistence/MappingsMemoryPersistence';
// import { MappingsController } from '../../src/logic/MappingsController';
// import { MappingsLambdaFunction } from '../../src/container/MappingsLambdaFunction';

// let MAPPING1: MappingV1 = {
//     id: '1',
//     customer_id: '1',
//     type: MappingTypeV1.Visa,
//     number: '1111111111111111',
//     expire_month: 1,
//     expire_year: 2021,
//     first_name: 'Bill',
//     last_name: 'Gates',
//     billing_address: {
//         line1: '2345 Swan Rd',
//         city: 'Tucson',
//         postal_code: '85710',
//         country_code: 'US'
//     },
//     ccv: '213',
//     name: 'Test Mapping 1',
//     saved: true,
//     default: true,
//     state: MappingStateV1.Ok
// };
// let MAPPING2: MappingV1 = {
//     id: '2',
//     customer_id: '1',
//     type: MappingTypeV1.Visa,
//     number: '2222222222222222',
//     expire_month: 4,
//     expire_year: 2028,
//     first_name: 'Joe',
//     last_name: 'Dow',
//     billing_address: {
//         line1: '123 Broadway Blvd',
//         city: 'New York',
//         postal_code: '123001',
//         country_code: 'US'
//     },
//     name: 'Test Mapping 2',
//     saved: true,
//     default: false,
//     state: MappingStateV1.Expired
// };

// suite('MappingsLambdaFunction', ()=> {
//     let lambda: MappingsLambdaFunction;

//     suiteSetup((done) => {
//         let config = ConfigParams.fromTuples(
//             'logger.descriptor', 'pip-services:logger:console:default:1.0',
//             'persistence.descriptor', 'pip-services-mappings:persistence:memory:default:1.0',
//             'controller.descriptor', 'pip-services-mappings:controller:default:default:1.0'
//         );

//         lambda = new MappingsLambdaFunction();
//         lambda.configure(config);
//         lambda.open(null, done);
//     });
    
//     suiteTeardown((done) => {
//         lambda.close(null, done);
//     });
    
//     test('CRUD Operations', (done) => {
//         var mapping1, mapping2: MappingV1;

//         async.series([
//         // Create one Mapping
//             (callback) => {
//                 lambda.act(
//                     {
//                         role: 'mappings',
//                         cmd: 'create_mapping',
//                         mapping: MAPPING1
//                     },
//                     (err, mapping) => {
//                         assert.isNull(err);

//                         assert.isObject(mapping);
//                         assert.equal(mapping.number, MAPPING1.number);
//                         assert.equal(mapping.expire_year, MAPPING1.expire_year);
//                         assert.equal(mapping.customer_id, MAPPING1.customer_id);

//                         mapping1 = mapping;

//                         callback();
//                     }
//                 );
//             },
//         // Create another Mapping
//             (callback) => {
//                 lambda.act(
//                     {
//                         role: 'mappings',
//                         cmd: 'create_mapping',
//                         mapping: MAPPING2
//                     },
//                     (err, mapping) => {
//                         assert.isNull(err);

//                         assert.isObject(mapping);
//                         assert.equal(mapping.number, MAPPING2.number);
//                         assert.equal(mapping.expire_year, MAPPING2.expire_year);
//                         assert.equal(mapping.customer_id, MAPPING2.customer_id);

//                         mapping2 = mapping;

//                         callback();
//                     }
//                 );
//             },
//         // Get all Mappings
//             (callback) => {
//                 lambda.act(
//                     {
//                         role: 'mappings',
//                         cmd: 'get_mappings' 
//                     },
//                     (err, page) => {
//                         assert.isNull(err);

//                         assert.isObject(page);
//                         assert.lengthOf(page.data, 2);

//                         callback();
//                     }
//                 );
//             },
//         // Update the Mapping
//             (callback) => {
//                 mapping1.name = 'Updated Mapping 1';

//                 lambda.act(
//                     {
//                         role: 'mappings',
//                         cmd: 'update_mapping',
//                         mapping: mapping1
//                     },
//                     (err, mapping) => {
//                         assert.isNull(err);

//                         assert.isObject(mapping);
//                         assert.equal(mapping.name, 'Updated Mapping 1');
//                         assert.equal(mapping.id, MAPPING1.id);

//                         mapping1 = mapping;

//                         callback();
//                     }
//                 );
//             },
//         // Delete Mapping
//             (callback) => {
//                 lambda.act(
//                     {
//                         role: 'mappings',
//                         cmd: 'delete_mapping_by_id',
//                         mapping_id: mapping1.id,
//                         customer_id: mapping1.customer_id
//                     },
//                     (err) => {
//                         assert.isNull(err);

//                         callback();
//                     }
//                 );
//             },
//         // Try to get delete Mapping
//             (callback) => {
//                 lambda.act(
//                     {
//                         role: 'mappings',
//                         cmd: 'get_mapping_by_id',
//                         mapping_id: mapping1.id,
//                         customer_id: mapping1.customer_id
//                     },
//                     (err, mapping) => {
//                         assert.isNull(err);

//                         assert.isNull(mapping || null);

//                         callback();
//                     }
//                 );
//             }
//         ], done);
//     });
// });