"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class MappingsHttpServiceV1 extends pip_services3_rpc_node_1.CommandableHttpService {
    constructor() {
        super('v1/mappings');
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('pip-services-mappings', 'controller', 'default', '*', '1.0'));
    }
}
exports.MappingsHttpServiceV1 = MappingsHttpServiceV1;
//# sourceMappingURL=MappingsHttpServiceV1.js.map