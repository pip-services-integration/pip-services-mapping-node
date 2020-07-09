import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { SortParams } from 'pip-services3-commons-node';

import { MappingV1 } from '../data/version1/MappingV1';
import { RatingV1 } from '../data/version1/RatingV1';

export interface IMappingsController {
    getMappings(correlationId: string, filter: FilterParams, paging: PagingParams, sorting: SortParams,
        callback: (err: any, page: DataPage<MappingV1>) => void): void;

    getMappingById(correlationId: string, mapping_id: string,
        callback: (err: any, mapping: MappingV1) => void): void;

    getPartyMapping(correlationId: string, party_id: string, product_id: string,
        callback: (err: any, mapping: MappingV1) => void): void;

    getProductRating(correlationId: string, product_id: string,
        callback: (err: any, rating: RatingV1) => void): void;
        
    submitMapping(correlationId: string, mapping: MappingV1, 
        callback: (err: any, rating: RatingV1) => void): void;

    reportHelpful(correlationId: string, mapping_id: string, party_id: string,
        callback: (err: any, mapping: MappingV1) => void): void;

    reportAbuse(correlationId: string, mapping_id: string, party_id: string,
        callback: (err: any, mapping: MappingV1) => void): void;
            
    deleteMappingById(correlationId: string, mapping_id: string,
        callback: (err: any, rating: RatingV1) => void): void;
}
