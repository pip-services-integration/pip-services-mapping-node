import { IStringIdentifiable } from 'pip-services3-commons-node';
export declare class MappingV1 implements IStringIdentifiable {
    id: string;
    collection: string;
    internal_id: string;
    external_id: string;
    expiration_time: Date;
    constructor(collection?: string, internalId?: string, externalId?: string, expirationTime?: Date);
}
