import { ProcessContainer } from 'pip-services3-container-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

import { MappingsServiceFactory } from '../build/MappingsServiceFactory';

export class MappingsProcess extends ProcessContainer {

    public constructor() {
        super("mappings", "Mappings microservice");
        this._factories.add(new MappingsServiceFactory);
        this._factories.add(new DefaultRpcFactory);
    }

}
