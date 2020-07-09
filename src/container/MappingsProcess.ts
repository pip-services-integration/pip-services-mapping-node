import { IReferences } from 'pip-services3-commons-node';
import { ProcessContainer } from 'pip-services3-container-node';

import { MappingsServiceFactory } from '../build/MappingsServiceFactory';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

export class MappingsProcess extends ProcessContainer {

    public constructor() {
        super("mappings", "Mappings microservice");
        this._factories.add(new MappingsServiceFactory);
        this._factories.add(new DefaultRpcFactory);
    }

}
