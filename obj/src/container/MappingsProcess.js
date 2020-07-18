"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_container_node_1 = require("pip-services3-container-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
const MappingsServiceFactory_1 = require("../build/MappingsServiceFactory");
class MappingsProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super("mappings", "Mappings microservice");
        this._factories.add(new MappingsServiceFactory_1.MappingsServiceFactory);
        this._factories.add(new pip_services3_rpc_node_1.DefaultRpcFactory);
    }
}
exports.MappingsProcess = MappingsProcess;
//# sourceMappingURL=MappingsProcess.js.map