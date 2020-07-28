"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const pip_services3_commons_node_6 = require("pip-services3-commons-node");
const pip_services3_commons_node_7 = require("pip-services3-commons-node");
const pip_services3_commons_node_8 = require("pip-services3-commons-node");
class MappingsCommandSet extends pip_services3_commons_node_1.CommandSet {
    constructor(logic) {
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
    makeGetCollectionNamesCommand() {
        return new pip_services3_commons_node_2.Command("get_collection_names", new pip_services3_commons_node_5.ObjectSchema(true), (correlationId, args, callback) => {
            this._logic.getCollectionNames(correlationId, callback);
        });
    }
    makeGetMappingsCommand() {
        return new pip_services3_commons_node_2.Command("get_mappings", new pip_services3_commons_node_5.ObjectSchema(true)
            .withOptionalProperty("filter", new pip_services3_commons_node_7.FilterParamsSchema())
            .withOptionalProperty("paging", new pip_services3_commons_node_8.PagingParamsSchema()), (correlationId, args, callback) => {
            var filter = pip_services3_commons_node_3.FilterParams.fromValue(args.get("filter"));
            var paging = pip_services3_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.getMappings(correlationId, filter, paging, callback);
        });
    }
    makeAddMappingCommand() {
        return new pip_services3_commons_node_2.Command("add_mapping", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty("collection", pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty("internal_id", pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty("external_id", pip_services3_commons_node_6.TypeCode.String)
            .withOptionalProperty("ttl", pip_services3_commons_node_6.TypeCode.Long), (correlationId, args, callback) => {
            var collection = args.getAsString("collection");
            var internalId = args.getAsString("internal_id");
            var externalId = args.getAsString("external_id");
            var ttl = args.getAsNullableLong("ttl");
            this._logic.addMapping(correlationId, collection, internalId, externalId, ttl, (err) => {
                callback(err, null);
            });
        });
    }
    makeMapToInternalCommand() {
        return new pip_services3_commons_node_2.Command("map_to_internal", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty("collection", pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty("external_id", pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            var collection = args.getAsString("collection");
            var externalId = args.getAsString("external_id");
            this._logic.mapToInternal(correlationId, collection, externalId, callback);
        });
    }
    makeMapToExternalCommand() {
        return new pip_services3_commons_node_2.Command("map_to_external", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty("collection", pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty("internal_id", pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            var collection = args.getAsString("collection");
            var internalId = args.getAsString("internal_id");
            this._logic.mapToExternal(correlationId, collection, internalId, callback);
        });
    }
    makeDeleteMappingCommand() {
        return new pip_services3_commons_node_2.Command("delete_mapping", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty("collection", pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty("internal_id", pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty("external_id", pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            var collection = args.getAsString("collection");
            var internalId = args.getAsString("internal_id");
            var externalId = args.getAsString("external_id");
            this._logic.deleteMapping(correlationId, collection, internalId, externalId, (err) => {
                callback(err, null);
            });
        });
    }
}
exports.MappingsCommandSet = MappingsCommandSet;
//# sourceMappingURL=MappingsCommandSet.js.map