import { ConfigParams } from 'pip-services3-commons-node';
import { JsonFilePersister } from 'pip-services3-data-node';

import { MappingsMemoryPersistence } from './MappingsMemoryPersistence';
import { MappingV1 } from '../data/version1/MappingV1';

export class MappingsFilePersistence extends MappingsMemoryPersistence {
    protected _persister: JsonFilePersister<MappingV1>;

    public constructor(path?: string) {
        super();

        this._persister = new JsonFilePersister<MappingV1>(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }

    public configure(config: ConfigParams): void {
        super.configure(config);
        this._persister.configure(config);
    }

}