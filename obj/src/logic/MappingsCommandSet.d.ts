import { CommandSet } from 'pip-services3-commons-node';
import { IMappingsController } from './IMappingsController';
export declare class MappingsCommandSet extends CommandSet {
    private _logic;
    constructor(logic: IMappingsController);
    private makeGetCollectionNamesCommand;
    private makeGetMappingsCommand;
    private makeAddMappingCommand;
    private makeMapToInternalCommand;
    private makeMapToExternalCommand;
    private makeDeleteMappingCommand;
}
