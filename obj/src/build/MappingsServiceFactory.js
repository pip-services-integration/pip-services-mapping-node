"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const MappingsMongoDbPersistence_1 = require("../persistence/MappingsMongoDbPersistence");
const MappingsFilePersistence_1 = require("../persistence/MappingsFilePersistence");
const MappingsMemoryPersistence_1 = require("../persistence/MappingsMemoryPersistence");
const MappingsController_1 = require("../logic/MappingsController");
const MappingsHttpServiceV1_1 = require("../services/version1/MappingsHttpServiceV1");
class MappingsServiceFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(MappingsServiceFactory.MemoryPersistenceDescriptor, MappingsMemoryPersistence_1.MappingsMemoryPersistence);
        this.registerAsType(MappingsServiceFactory.FilePersistenceDescriptor, MappingsFilePersistence_1.MappingsFilePersistence);
        this.registerAsType(MappingsServiceFactory.MongoDbPersistenceDescriptor, MappingsMongoDbPersistence_1.MappingsMongoDbPersistence);
        this.registerAsType(MappingsServiceFactory.ControllerDescriptor, MappingsController_1.MappingsController);
        this.registerAsType(MappingsServiceFactory.HttpServiceDescriptor, MappingsHttpServiceV1_1.MappingsHttpServiceV1);
    }
}
exports.MappingsServiceFactory = MappingsServiceFactory;
MappingsServiceFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services-mappings", "factory", "default", "default", "1.0");
MappingsServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-mappings", "persistence", "memory", "*", "1.0");
MappingsServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-mappings", "persistence", "file", "*", "1.0");
MappingsServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-mappings", "persistence", "mongodb", "*", "1.0");
MappingsServiceFactory.ControllerDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-mappings", "controller", "default", "*", "1.0");
MappingsServiceFactory.HttpServiceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-mappings", "service", "http", "*", "1.0");
//# sourceMappingURL=MappingsServiceFactory.js.map