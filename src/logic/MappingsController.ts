// let async = require('async');

// import { ConfigParams } from 'pip-services3-commons-node';
// import { IConfigurable } from 'pip-services3-commons-node';
// import { IReferences } from 'pip-services3-commons-node';
// import { Descriptor } from 'pip-services3-commons-node';
// import { IReferenceable } from 'pip-services3-commons-node';
// import { DependencyResolver } from 'pip-services3-commons-node';
// import { FilterParams } from 'pip-services3-commons-node';
// import { PagingParams } from 'pip-services3-commons-node';
// import { DataPage } from 'pip-services3-commons-node';
// import { ICommandable } from 'pip-services3-commons-node';
// import { CommandSet } from 'pip-services3-commons-node';
// import { BadRequestException } from 'pip-services3-commons-node';

// import { MappingV1 } from '../data/version1/MappingV1';
// import { MappingStateV1 } from '../data/version1/MappingStateV1';
// import { IMappingsPersistence } from '../persistence/IMappingsPersistence';
// import { IMappingsController } from './IMappingsController';
// import { MappingsCommandSet } from './MappingsCommandSet';
// import { UnauthorizedException } from 'pip-services3-commons-node/obj/src/errors/UnauthorizedException';

// export class MappingsController implements  IConfigurable, IReferenceable, ICommandable, IMappingsController {
//     private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
//         'dependencies.persistence', 'pip-services-mappings:persistence:*:*:1.0'
//     );

//     private _dependencyResolver: DependencyResolver = new DependencyResolver(MappingsController._defaultConfig);
//     private _persistence: IMappingsPersistence;
//     private _commandSet: MappingsCommandSet;

//     public configure(config: ConfigParams): void {
//         this._dependencyResolver.configure(config);
//     }

//     public setReferences(references: IReferences): void {
//         this._dependencyResolver.setReferences(references);
//         this._persistence = this._dependencyResolver.getOneRequired<IMappingsPersistence>('persistence');
//     }

//     public getCommandSet(): CommandSet {
//         if (this._commandSet == null)
//             this._commandSet = new MappingsCommandSet(this);
//         return this._commandSet;
//     }
    
//     public getMappings(correlationId: string, filter: FilterParams, paging: PagingParams, 
//         callback: (err: any, page: DataPage<MappingV1>) => void): void {
//         this._persistence.getPageByFilter(correlationId, filter, paging, callback);
//     }

//     public getMappingById(correlationId: string, id: string, customerId: string,
//         callback: (err: any, mapping: MappingV1) => void): void {
//         this._persistence.getOneById(correlationId, id, (err, mapping) => {
//             // Do not allow to access mapping of different customer
//             if (mapping && mapping.customer_id != customerId)
//                 mapping = null;
            
//             callback(err, mapping);
//         });
//     }

//     public createMapping(correlationId: string, mapping: MappingV1, 
//         callback: (err: any, mapping: MappingV1) => void): void {

//         mapping.state = mapping.state || MappingStateV1.Ok;
//         mapping.create_time = new Date();
//         mapping.update_time = new Date();

//         this._persistence.create(correlationId, mapping, callback);
//     }

//     public updateMapping(correlationId: string, mapping: MappingV1, 
//         callback: (err: any, mapping: MappingV1) => void): void {

//         let newMapping: MappingV1;

//         mapping.state = mapping.state || MappingStateV1.Ok;
//         mapping.update_time = new Date();
    
//         async.series([
//             (callback) => {
//                 this._persistence.getOneById(correlationId, mapping.id, (err, data) => {
//                     if (err == null && data && data.customer_id != mapping.customer_id) {
//                         err = new BadRequestException(correlationId, 'WRONG_CUST_ID', 'Wrong Mapping customer id')
//                             .withDetails('id', mapping.id)
//                             .withDetails('customer_id', mapping.customer_id);
//                     }
//                     callback(err);
//                 });
//             },
//             (callback) => {
//                 this._persistence.update(correlationId, mapping, (err, data) => {
//                     newMapping = data;
//                     callback(err);
//                 });
//             }
//         ], (err) => {
//             callback(err, newMapping);
//         });
//     }

//     public deleteMappingById(correlationId: string, id: string, customerId: string,
//         callback: (err: any, mapping: MappingV1) => void): void {  

//         let oldMapping: MappingV1;

//         async.series([
//             (callback) => {
//                 this._persistence.getOneById(correlationId, id, (err, data) => {
//                     if (err == null && data && data.customer_id != customerId) {
//                         err = new BadRequestException(correlationId, 'WRONG_CUST_ID', 'Wrong Mapping customer id')
//                             .withDetails('id', id)
//                             .withDetails('customer_id', customerId);
//                     }
//                     callback(err);
//                 });
//             },
//             (callback) => {
//                 this._persistence.deleteById(correlationId, id, (err, data) => {
//                     oldMapping = data;
//                     callback(err);
//                 });
//             }
//         ], (err) => {
//             if (callback) callback(err, oldMapping);
//         });
//     }

// }
