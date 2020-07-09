// let _ = require('lodash');
// let async = require('async');
// let assert = require('chai').assert;

// import { FilterParams } from 'pip-services3-commons-node';
// import { PagingParams } from 'pip-services3-commons-node';

// import { MappingV1 } from '../../src/data/version1/MappingV1';
// import { MappingTypeV1 } from '../../src/data/version1/MappingTypeV1';
// import { MappingStateV1 } from '../../src/data/version1/MappingStateV1';

// import { IMappingsPersistence } from '../../src/persistence/IMappingsPersistence';
// import { RatingV1 } from '../../src/data/version1/RatingV1';

// let MAPPING1: MappingV1 = {
//     id: '1',
//     customer_id: '1',
//     type: MappingTypeV1.Visa,
//     number: '4032036094894795',
//     expire_month: 1,
//     expire_year: 2021,
//     first_name: 'Bill',
//     last_name: 'Gates',
//     billing_address: {
//         line1: '2345 Swan Rd',
//         city: 'Tucson',
//         state: 'AZ',
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
//     number: '4032037578262780',
//     expire_month: 4,
//     expire_year: 2028,
//     first_name: 'Joe',
//     last_name: 'Dow',
//     billing_address: {
//         line1: '123 Broadway Blvd',
//         city: 'New York',
//         state: 'NY',
//         postal_code: '123001',
//         country_code: 'US'
//     },
//     name: 'Test Mapping 2',
//     saved: true,
//     default: false,
//     state: MappingStateV1.Expired
// };
// let MAPPING3: MappingV1 = {
//     id: '3',
//     customer_id: '2',
//     type: MappingTypeV1.Visa,
//     number: '4032037578262780',
//     expire_month: 5,
//     expire_year: 2022,
//     first_name: 'Steve',
//     last_name: 'Jobs',
//     billing_address: {
//         line1: '234 6th Str',
//         city: 'Los Angeles',
//         state: 'CA',
//         postal_code: '65320',
//         country_code: 'US'
//     },
//     ccv: '124',
//     name: 'Test Mapping 2',
//     state: MappingStateV1.Ok
// };

// export class MappingsPersistenceFixture {
//     private _persistence: IMappingsPersistence;
    
//     constructor(persistence) {
//         assert.isNotNull(persistence);
//         this._persistence = persistence;
//     }

//     private testCreateMappings(done) {
//         async.series([
//         // Create one Mapping
//             (callback) => {
//                 this._persistence.create(
//                     null,
//                     MAPPING1,
//                     (err, mapping) => {
//                         assert.isNull(err);

//                         assert.isObject(mapping);
//                         assert.equal(mapping.first_name, MAPPING1.first_name);
//                         assert.equal(mapping.last_name, MAPPING1.last_name);
//                         assert.equal(mapping.expire_year, MAPPING1.expire_year);
//                         assert.equal(mapping.customer_id, MAPPING1.customer_id);

//                         callback();
//                     }
//                 );
//             },
//         // Create another Mapping
//             (callback) => {
//                 this._persistence.create(
//                     null,
//                     MAPPING2,
//                     (err, mapping) => {
//                         assert.isNull(err);

//                         assert.isObject(mapping);
//                         assert.equal(mapping.first_name, MAPPING2.first_name);
//                         assert.equal(mapping.last_name, MAPPING2.last_name);
//                         assert.equal(mapping.expire_year, MAPPING2.expire_year);
//                         assert.equal(mapping.customer_id, MAPPING2.customer_id);

//                         callback();
//                     }
//                 );
//             },
//         // Create yet another Mapping
//             (callback) => {
//                 this._persistence.create(
//                     null,
//                     MAPPING3,
//                     (err, mapping) => {
//                         assert.isNull(err);

//                         assert.isObject(mapping);
//                         assert.equal(mapping.first_name, MAPPING3.first_name);
//                         assert.equal(mapping.last_name, MAPPING3.last_name);
//                         assert.equal(mapping.expire_year, MAPPING3.expire_year);
//                         assert.equal(mapping.customer_id, MAPPING3.customer_id);

//                         callback();
//                     }
//                 );
//             }
//         ], done);
//     }
                
//     testCrudOperations(done) {
//         let mapping1: MappingV1;

//         async.series([
//         // Create items
//             (callback) => {
//                 this.testCreateMappings(callback);
//             },
//         // Get all Mappings
//             (callback) => {
//                 this._persistence.getPageByFilter(
//                     null,
//                     new FilterParams(),
//                     new PagingParams(),
//                     (err, page) => {
//                         assert.isNull(err);

//                         assert.isObject(page);
//                         assert.lengthOf(page.data, 3);

//                         mapping1 = page.data[0];

//                         callback();
//                     }
//                 );
//             },
//         // Update the Mapping
//             (callback) => {
//                 mapping1.name = 'Updated Mapping 1';

//                 this._persistence.update(
//                     null,
//                     mapping1,
//                     (err, mapping) => {
//                         assert.isNull(err);

//                         assert.isObject(mapping);
//                         assert.equal(mapping.name, 'Updated Mapping 1');
//                         // PayPal changes id on update
//                         //!!assert.equal(mapping.id, mapping1.id);

//                         mapping1 = mapping;

//                         callback();
//                     }
//                 );
//             },
//         // Delete Mapping
//             (callback) => {
//                 this._persistence.deleteById(
//                     null,
//                     mapping1.id,
//                     (err) => {
//                         assert.isNull(err);

//                         callback();
//                     }
//                 );
//             },
//         // Try to get delete Mapping
//             (callback) => {
//                 this._persistence.getOneById(
//                     null,
//                     mapping1.id,
//                     (err, mapping) => {
//                         assert.isNull(err);

//                         assert.isNull(mapping || null);

//                         callback();
//                     }
//                 );
//             }
//         ], done);
//     }

//     testGetWithFilter(done) {
//         async.series([
//         // Create Mappings
//             (callback) => {
//                 this.testCreateMappings(callback);
//             },
//         // Get Mappings filtered by customer id
//             (callback) => {
//                 this._persistence.getPageByFilter(
//                     null,
//                     FilterParams.fromValue({
//                         customer_id: '1'
//                     }),
//                     new PagingParams(),
//                     (err, page) => {
//                         assert.isNull(err);

//                         assert.isObject(page);
//                         assert.lengthOf(page.data, 2);

//                         callback();
//                     }
//                 );
//             },
//         // Get Mappings by state
//             (callback) => {
//                 this._persistence.getPageByFilter(
//                     null,
//                     FilterParams.fromValue({
//                         state: 'ok'
//                     }),
//                     new PagingParams(),
//                     (err, page) => {
//                         assert.isNull(err);

//                         assert.isObject(page);
//                         // PayPal calculate states by itself
//                         //assert.lengthOf(page.data, 2);

//                         callback();
//                     }
//                 );
//             },
//         // Get Mappings by saved
//             (callback) => {
//                 this._persistence.getPageByFilter(
//                     null,
//                     FilterParams.fromValue({
//                         saved: true
//                     }),
//                     new PagingParams(),
//                     (err, page) => {
//                         assert.isNull(err);

//                         assert.isObject(page);
//                         assert.lengthOf(page.data, 2);

//                         callback();
//                     }
//                 );
//             },
//         // Get Mappings by ids
//             (callback) => {
//                 this._persistence.getPageByFilter(
//                     null,
//                     FilterParams.fromValue({
//                         ids: ['1', '3']
//                     }),
//                     new PagingParams(),
//                     (err, page) => {
//                         assert.isNull(err);

//                         assert.isObject(page);
//                         // PayPal manages ids by itself
//                         //assert.lengthOf(page.data, 2);

//                         callback();
//                     }
//                 );
//             },
//         ], done);
//     }

// }
