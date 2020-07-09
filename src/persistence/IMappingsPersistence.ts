import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IGetter } from 'pip-services3-data-node';

import { MappingV1 } from '../data/version1/MappingV1';
import { RatingV1 } from '../data/version1/RatingV1';

export interface IMappingsPersistence extends IGetter<MappingV1, string> {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<MappingV1>) => void): void;

    getOneById(correlationId: string, id: string, 
        callback: (err: any, item: MappingV1) => void): void;

    set(correlationId: string, item: MappingV1, 
        callback: (err: any, rating: RatingV1) => void): void;

    increment(correlationId: string, rating: RatingV1, 
        callback: (err: any, rating: RatingV1) => void): void;

    deleteById(correlationId: string, id: string,
        callback: (err: any, item: MappingV1) => void): void;
}
