import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';


export class MappingV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withOptionalProperty('id', TypeCode.String);
        
        this.withRequiredProperty('collection', TypeCode.String);
        this.withRequiredProperty('internal_id', TypeCode.String);
        this.withRequiredProperty('external_id', TypeCode.String);
        this.withRequiredProperty('expiration_time', null);
    }
}
