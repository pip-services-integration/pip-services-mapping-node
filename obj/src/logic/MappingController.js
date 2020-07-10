"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const MappingsCommandSet_1 = require("./MappingsCommandSet");
const pip_services3_components_node_1 = require("pip-services3-components-node");
class MappingController {
    constructor() {
        this.component = "Integration.MappingController";
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        this._counters = new pip_services3_components_node_1.CompositeCounters();
        this._dependencyResolver = new pip_services3_commons_node_2.DependencyResolver(MappingController._defaultConfig);
        this._dependencyResolver = new pip_services3_commons_node_2.DependencyResolver(pip_services3_commons_node_1.ConfigParams.fromTuples("dependencies.persistence", "pip-services-mappings:persistence:*:*:1.0"));
    }
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired("persistence");
    }
    getCommandSet() {
        return this._commandSet || (this._commandSet = new MappingsCommandSet_1.MappingsCommandSet(this));
    }
    instrument(correlationId, methodName, message) {
        this._logger.trace(correlationId, "Executed %s.%s %s", this.component, methodName, message);
        return this._counters.beginTiming(this.component + "." + methodName + ".exec_time");
    }
    handleError(correlationId, methodName, ex) {
        this._logger.error(correlationId, ex, "Failed to execute %s.%s", this.component, methodName);
    }
    getCollectionNames(correlationId, callback) {
        var time = this.instrument(correlationId, "getCollectionNames", "");
        this._persistence.getCollectionNames(correlationId, (err, items) => {
            time.endTiming();
            if (err) {
                this.handleError(correlationId, "getCollectionNames", err);
            }
            callback(err, items);
        });
    }
    getMappings(correlationId, filter, paging, callback) {
        var time = this.instrument(correlationId, "getMappings", "");
        this._persistence.getPageByFilter(correlationId, filter, paging, (err, page) => {
            time.endTiming();
            if (err) {
                this.handleError(correlationId, "getMappings", err);
            }
            callback(err, page);
        });
    }
    addMapping(correlationId, collection, internalId, externalId, timeToLive, callback) {
        var time = this.instrument(correlationId, "addMapping", "");
        this._persistence.createFromParams(correlationId, collection, internalId, externalId, timeToLive, (err, item) => {
            time.endTiming();
            if (err) {
                this.handleError(correlationId, "addMapping", err);
            }
            callback(err);
        });
    }
    mapToExternal(correlationId, collection, internalId, callback) {
        var time = this.instrument(correlationId, "mapToExternal", "");
        this._persistence.getByInternalId(correlationId, collection, internalId, (err, id) => {
            time.endTiming();
            if (err) {
                this.handleError(correlationId, "mapToExternal", err);
            }
            callback(err, id);
        });
    }
    mapToInternal(correlationId, collection, externalId, callback) {
        var time = this.instrument(correlationId, "mapToInternal", "");
        this._persistence.getByExternalId(correlationId, collection, externalId, (err, id) => {
            time.endTiming();
            if (err) {
                this.handleError(correlationId, "mapToInternal", err);
            }
            callback(err, id);
        });
    }
    deleteMapping(correlationId, collection, internalId, externalId, callback) {
        var time = this.instrument(correlationId, "deleteMapping", "");
        this._persistence.delete(correlationId, collection, internalId, externalId, (err) => {
            time.endTiming();
            if (err) {
                this.handleError(correlationId, "deleteMapping", err);
            }
            callback(err);
        });
    }
    deleteExpiredMappings(correlationId, callback) {
        var time = this.instrument(correlationId, "deleteExpiredMappings", "");
        this._persistence.deleteExpired(correlationId, (err) => {
            time.endTiming();
            if (err) {
                this.handleError(correlationId, "deleteExpiredMappings", err);
            }
            callback(err);
        });
    }
}
exports.MappingController = MappingController;
MappingController._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples('dependencies.persistence', 'pip-services-mappings:persistence:*:*:1.0');
//# sourceMappingURL=MappingController.js.map