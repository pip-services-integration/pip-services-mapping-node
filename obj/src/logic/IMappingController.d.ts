import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { MappingV1 } from '../data/version1/MappingV1';
export interface IMappingController {
    getCollectionNames(correlationId: string, callback: (err: any, items: Array<string>) => void): any;
    getMappings(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<MappingV1>) => void): any;
    addMapping(correlationId: string, collection: string, internalId: string, externalId: string, timeToLive: number, callback: (err: any) => void): any;
    mapToExternal(correlationId: string, collection: string, internalId: string, callback: (err: any, externalId: string) => void): any;
    mapToInternal(correlationId: string, collection: string, externalId: string, callback: (err: any, internalId: string) => void): any;
    deleteMapping(correlationId: string, collection: string, internalId: string, externalId: string, callback: (err: any) => void): any;
    deleteExpiredMappings(correlationId: string, callback: (err: any) => void): any;
}
