import { CommandSet } from 'pip-services3-commons-node';
import { IMappingController } from './IMappingController';
export declare class MappingsCommandSet extends CommandSet {
    private _logic;
    constructor(logic: IMappingController);
    private makeGetCollectionNamesCommand;
    private makeGetMappingsCommand;
    private makeAddMappingCommand;
    private makeMapToInternalCommand;
    private makeMapToExternalCommand;
    private makeDeleteMappingCommand;
}
