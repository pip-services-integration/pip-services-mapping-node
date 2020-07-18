"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const MappingsCommandSet_1 = require("./MappingsCommandSet");
class MappingsController {
    constructor() {
        this._dependencyResolver = new pip_services3_commons_node_2.DependencyResolver(MappingsController._defaultConfig);
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        this._timer = new pip_services3_commons_node_3.FixedRateTimer();
        this._interval = 300000;
    }
    configure(config) {
        this._logger.configure(config);
        this._dependencyResolver.configure(config);
        this._interval = config.getAsIntegerWithDefault("options.interval", this._interval);
    }
    setReferences(references) {
        this._logger.setReferences(references);
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired("persistence");
    }
    getCommandSet() {
        return this._commandSet || (this._commandSet = new MappingsCommandSet_1.MappingsCommandSet(this));
    }
    isOpen() {
        return this._timer != null && this._timer.isStarted();
    }
    open(correlationId, callback) {
        this._timer.setDelay(this._interval);
        this._timer.setInterval(this._interval);
        this._timer.setCallback(() => {
            this._logger.info(correlationId, 'Cleaning expired mappings.');
            this.deleteExpiredMappings(correlationId, (err) => {
                if (err)
                    this._logger.error(correlationId, err, 'Failed to clean expired mappings');
            });
        });
        this._timer.start();
        callback(null);
    }
    close(correlationId, callback) {
        this._timer.stop();
        callback(null);
    }
    getCollectionNames(correlationId, callback) {
        this._persistence.getCollectionNames(correlationId, callback);
    }
    getMappings(correlationId, filter, paging, callback) {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    addMapping(correlationId, collection, internalId, externalId, timeToLive, callback) {
        this._persistence.createFromParams(correlationId, collection, internalId, externalId, timeToLive, callback);
    }
    mapToExternal(correlationId, collection, internalId, callback) {
        this._persistence.getByInternalId(correlationId, collection, internalId, callback);
    }
    mapToInternal(correlationId, collection, externalId, callback) {
        this._persistence.getByExternalId(correlationId, collection, externalId, callback);
    }
    deleteMapping(correlationId, collection, internalId, externalId, callback) {
        this._persistence.delete(correlationId, collection, internalId, externalId, callback);
    }
    deleteExpiredMappings(correlationId, callback) {
        this._persistence.deleteExpired(correlationId, callback);
    }
}
exports.MappingsController = MappingsController;
MappingsController._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples('dependencies.persistence', 'pip-services-mappings:persistence:*:*:1.0');
//# sourceMappingURL=MappingsController.js.map