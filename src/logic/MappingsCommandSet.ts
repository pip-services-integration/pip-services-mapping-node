// import { CommandSet } from 'pip-services3-commons-node';
// import { ICommand } from 'pip-services3-commons-node';
// import { Command } from 'pip-services3-commons-node';
// import { Schema } from 'pip-services3-commons-node';
// import { Parameters } from 'pip-services3-commons-node';
// import { FilterParams } from 'pip-services3-commons-node';
// import { PagingParams } from 'pip-services3-commons-node';
// import { ObjectSchema } from 'pip-services3-commons-node';
// import { TypeCode } from 'pip-services3-commons-node';
// import { FilterParamsSchema } from 'pip-services3-commons-node';
// import { PagingParamsSchema } from 'pip-services3-commons-node';

// import { MappingV1 } from '../data/version1/MappingV1';
// import { MappingV1Schema } from '../data/version1/MappingV1Schema';
// import { IMappingsController } from './IMappingsController';

// export class MappingsCommandSet extends CommandSet {
//     private _logic: IMappingsController;

//     constructor(logic: IMappingsController) {
//         super();

//         this._logic = logic;

//         // Register commands to the database
// 		this.addCommand(this.makeGetMappingsCommand());
// 		this.addCommand(this.makeGetMappingByIdCommand());
// 		this.addCommand(this.makeCreateMappingCommand());
// 		this.addCommand(this.makeUpdateMappingCommand());
// 		this.addCommand(this.makeDeleteMappingByIdCommand());
//     }

// 	private makeGetMappingsCommand(): ICommand {
// 		return new Command(
// 			"get_mappings",
// 			new ObjectSchema(true)
// 				.withOptionalProperty('filter', new FilterParamsSchema())
// 				.withOptionalProperty('paging', new PagingParamsSchema()),
//             (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
//                 let filter = FilterParams.fromValue(args.get("filter"));
//                 let paging = PagingParams.fromValue(args.get("paging"));
//                 this._logic.getMappings(correlationId, filter, paging, callback);
//             }
// 		);
// 	}

// 	private makeGetMappingByIdCommand(): ICommand {
// 		return new Command(
// 			"get_mapping_by_id",
// 			new ObjectSchema(true)
// 				.withRequiredProperty('mapping_id', TypeCode.String)
// 				.withRequiredProperty('customer_id', TypeCode.String),
//             (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
//                 let mappingId = args.getAsString("mapping_id");
//                 let customerId = args.getAsString("customer_id");
//                 this._logic.getMappingById(correlationId, mappingId, customerId, callback);
//             }
// 		);
// 	}

// 	private makeCreateMappingCommand(): ICommand {
// 		return new Command(
// 			"create_mapping",
// 			new ObjectSchema(true)
// 				.withRequiredProperty('mapping', new MappingV1Schema()),
//             (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
//                 let mapping = args.get("mapping");
//                 this._logic.createMapping(correlationId, mapping, callback);
//             }
// 		);
// 	}

// 	private makeUpdateMappingCommand(): ICommand {
// 		return new Command(
// 			"update_mapping",
// 			new ObjectSchema(true)
// 				.withRequiredProperty('mapping', new MappingV1Schema()),
//             (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
//                 let mapping = args.get("mapping");
//                 this._logic.updateMapping(correlationId, mapping, callback);
//             }
// 		);
// 	}
	
// 	private makeDeleteMappingByIdCommand(): ICommand {
// 		return new Command(
// 			"delete_mapping_by_id",
// 			new ObjectSchema(true)
// 				.withRequiredProperty('mapping_id', TypeCode.String)
// 				.withRequiredProperty('customer_id', TypeCode.String),
//             (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
//                 let mappingId = args.getAsNullableString("mapping_id");
//                 let customerId = args.getAsString("customer_id");
//                 this._logic.deleteMappingById(correlationId, mappingId, customerId, callback);
// 			}
// 		);
// 	}

// }