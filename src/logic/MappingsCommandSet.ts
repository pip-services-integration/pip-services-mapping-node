import { CommandSet } from 'pip-services3-commons-node';
import { ICommand } from 'pip-services3-commons-node';
import { Command } from 'pip-services3-commons-node';
import { Parameters } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { FilterParamsSchema } from 'pip-services3-commons-node';
import { PagingParamsSchema } from 'pip-services3-commons-node';

import { IMappingsController } from './IMappingController';

export class MappingsCommandSet extends CommandSet {
    private _logic: IMappingsController;

    constructor(logic: IMappingsController) {
        super();

        this._logic = logic;

        // Register commands to the database
        this.addCommand(this.makeGetCollectionNamesCommand());
        this.addCommand(this.makeGetMappingsCommand());
        this.addCommand(this.makeAddMappingCommand());
        this.addCommand(this.makeMapToInternalCommand());
        this.addCommand(this.makeMapToExternalCommand());
        this.addCommand(this.makeDeleteMappingCommand());
    }


    private makeGetCollectionNamesCommand(): ICommand {
        return new Command(
            "get_collection_names",
            new ObjectSchema(),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                this._logic.getCollectionNames(correlationId, callback);
            });
    }

    private makeGetMappingsCommand(): ICommand {
        return new Command(
            "get_mappings",
            new ObjectSchema()
                .withOptionalProperty("filter", new FilterParamsSchema())
                .withOptionalProperty("paging", new PagingParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                var filter = FilterParams.fromValue(args.get("filter"));
                var paging = PagingParams.fromValue(args.get("paging"));
                this._logic.getMappings(correlationId, filter, paging, callback);
            });
    }

    private makeAddMappingCommand(): ICommand {
        return new Command(
            "add_mapping",
            new ObjectSchema(true)
                .withRequiredProperty("collection", TypeCode.String)
                .withRequiredProperty("internal_id", TypeCode.String)
                .withRequiredProperty("external_id", TypeCode.String)
                .withOptionalProperty("ttl", TypeCode.Long), 
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                var collection = args.getAsString("collection");
                var internalId = args.getAsString("internal_id");
                var externalId = args.getAsString("external_id");
                var ttl = args.getAsNullableLong("ttl");
                this._logic.addMapping(correlationId, collection, internalId, externalId, ttl, (err) => {
                    callback(err, null);
                });

            });
    }

    private makeMapToInternalCommand(): ICommand {
        return new Command(
            "map_to_internal",
            new ObjectSchema(true)
                .withRequiredProperty("collection", TypeCode.String)
                .withRequiredProperty("external_id", TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                var collection = args.getAsString("collection");
                var externalId = args.getAsString("external_id");
                this._logic.mapToInternal(correlationId, collection, externalId, callback);
            });
    }

    private makeMapToExternalCommand(): ICommand {
        return new Command(
            "map_to_external",
            new ObjectSchema(true)
                .withRequiredProperty("collection", TypeCode.String)
                .withRequiredProperty("internal_id", TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                var collection = args.getAsString("collection");
                var internalId = args.getAsString("internal_id");
                this._logic.mapToExternal(correlationId, collection, internalId, callback);
            });
    }

    private makeDeleteMappingCommand(): ICommand {
        return new Command(
            "delete_mapping",
            new ObjectSchema(true)
                .withRequiredProperty("collection", TypeCode.String)
                .withRequiredProperty("internal_id", TypeCode.String)
                .withRequiredProperty("external_id", TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                var collection = args.getAsString("collection");
                var internalId = args.getAsString("internal_id");
                var externalId = args.getAsString("external_id");
                this._logic.deleteMapping(correlationId, collection, internalId, externalId, (err) => {
                    callback(err, null);
                });
            });
    }

}