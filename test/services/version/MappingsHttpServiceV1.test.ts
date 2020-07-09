// let _ = require('lodash');
// let async = require('async');
// let restify = require('restify');
// let assert = require('chai').assert;

// import { ConfigParams } from 'pip-services3-commons-node';
// import { Descriptor } from 'pip-services3-commons-node';
// import { References } from 'pip-services3-commons-node';

// import { MappingV1 } from '../../../src/data/version1/MappingV1';
// import { MappingTypeV1 } from '../../../src/data/version1/MappingTypeV1';
// import { MappingStateV1 } from '../../../src/data/version1/MappingStateV1';
// import { MappingsMemoryPersistence } from '../../../src/persistence/MappingsMemoryPersistence';
// import { MappingsController } from '../../../src/logic/MappingsController';
// import { MappingsHttpServiceV1 } from '../../../src/services/version1/MappingsHttpServiceV1';

// let httpConfig = ConfigParams.fromTuples(
//     "connection.protocol", "http",
//     "connection.host", "localhost",
//     "connection.port", 3000
// );

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


// suite('MappingsHttpServiceV1', ()=> {    
//     let service: MappingsHttpServiceV1;
//     let rest: any;

//     suiteSetup((done) => {
//         let persistence = new MappingsMemoryPersistence();
//         let controller = new MappingsController();

//         service = new MappingsHttpServiceV1();
//         service.configure(httpConfig);

//         let references: References = References.fromTuples(
//             new Descriptor('pip-services-mappings', 'persistence', 'memory', 'default', '1.0'), persistence,
//             new Descriptor('pip-services-mappings', 'controller', 'default', 'default', '1.0'), controller,
//             new Descriptor('pip-services-mappings', 'service', 'http', 'default', '1.0'), service
//         );
//         controller.setReferences(references);
//         service.setReferences(references);

//         service.open(null, done);
//     });
    
//     suiteTeardown((done) => {
//         service.close(null, done);
//     });

//     setup(() => {
//         let url = 'http://localhost:3000';
//         rest = restify.createJsonClient({ url: url, version: '*' });
//     });
    
    
//     test('CRUD Operations', (done) => {
//         let mapping1, mapping2: MappingV1;

//         async.series([
//         // Create one Mapping
//             (callback) => {
//                 rest.post('/v1/mappings/create_mapping',
//                     {
//                         mapping: MAPPING1
//                     },
//                     (err, req, res, mapping) => {
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
//                 rest.post('/v1/mappings/create_mapping', 
//                     {
//                         mapping: MAPPING2
//                     },
//                     (err, req, res, mapping) => {
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
//                 rest.post('/v1/mappings/get_mappings',
//                     {},
//                     (err, req, res, page) => {
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

//                 rest.post('/v1/mappings/update_mapping',
//                     { 
//                         mapping: mapping1
//                     },
//                     (err, req, res, mapping) => {
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
//                 rest.post('/v1/mappings/delete_mapping_by_id',
//                     {
//                         mapping_id: mapping1.id,
//                         customer_id: mapping1.customer_id
//                     },
//                     (err, req, res, result) => {
//                         assert.isNull(err);

//                         //assert.isNull(result);

//                         callback();
//                     }
//                 );
//             },
//         // Try to get delete Mapping
//             (callback) => {
//                 rest.post('/v1/mappings/get_mapping_by_id',
//                     {
//                         mapping_id: mapping1.id,
//                         customer_id: mapping1.customer_id
//                     },
//                     (err, req, res, result) => {
//                         assert.isNull(err);

//                         //assert.isNull(result);

//                         callback();
//                     }
//                 );
//             }
//         ], done);
//     });
// });