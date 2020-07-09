import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IGetter } from 'pip-services3-data-node';

import { MappingV1 } from '../data/version1/MappingV1';

export interface IMappingsPersistence {

    getCollectionNames(correlationId: string, callback: (err: any, items: Array<string>) => void): void;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<MappingV1>) => void): void;
    createFromParams(correlationId: string, collection: string, internalId: string, externalId: string, timeToLive: number, callback: (err: any, item: MappingV1) => void): void;
    getByInternalId(correlationId: string, collection: string, internalId: string, callback: (err: any, externalId: string) => void): void;
    getByExternalId(correlationId: string, collection: string, externalId: string, callback: (err: any, internalId: string) => void): void;
    delete(correlationId: string, collection: string, internalId: string, externalId: string, callback: (err: any) => void): void;
    deleteExpired(correlationId: string, callback: (err: any) => void): void;
    clear(correlationId: string, callback: (err: any) => void): void;



}
