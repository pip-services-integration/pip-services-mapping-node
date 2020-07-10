# HTTP Protocol (version 1) <br/> Mappings Microservice

Jobs microservice implements a HTTP compatible API, that can be accessed on configured port.
All input and output data is serialized in JSON format. Errors are returned in [standard format]().

* [POST /v1/mappings/get_collection_names](#operation1)
* [POST /v1/mappings/get_mappings](#operation2)
* [POST /v1/mappings/add_mapping](#operation3)
* [POST /v1/mappings/map_to_internal](#operation4)
* [POST /v1/jomappingsbs/map_to_external](#operation5)
* [POST /v1/mappings/delete_mapping](#operation6)

## Operations

### <a name="operation1"></a> Method: 'POST', route '/v1/mappings/get_collection_names'

Get all collections names

**Request body:** 
- none

**Response body:**
items:Arary<string> - array with collection names

### <a name="operation2"></a> Method: 'POST', route '/v1/mappings/get_mappings'

Get mapping by filter

**Request body:** 
- filter: Object
    - id: string - (optional) unique mapping id
    - collection: string - (optional) mapping collection name
    - internal_id: string - (optional) internal id
    - external_id: string - (optional) external id
    - search: string - (optional) search pattern in internal_id and external_id fields 
- paging: Object
  - skip: int - (optional) start of page (default: 0). Operation returns paged result
  - take: int - (optional) page length (max: 100). Operation returns paged result

**Response body:**
- page: DataPage<MappingV1> - page with retrived mappings

### <a name="operation3"></a> Method: 'POST', route '/v1/mappings/add_mapping'

Add mapping

**Request body:**
- collection: string - collection name
- internal_id: string - internal id
- external_id: string - external id
- ttl: number -  Time to live in ms

**Response body:**
- none

### <a name="operation4"></a> Method: 'POST', route '/v1/mappings/map_to_internal'

Get internal id by external id and collection name

**Request body:**
- collection: string - collecton name
- external_id: string - external id value

**Response body:**
- internal_id: string - internal id value

### <a name="operation5"></a> Method: 'POST', route 'map_to_external'

Get external id by internal id and collection name

**Request body:**
- collection: string - collecton name
- internal_id: string - external id value

**Response body:**
- external_id: string - external id value

### <a name="operation6"></a> Method: 'POST', route '/v1/mappings/delete_mapping'

 Delete mapping by 

**Request body:**
- collection: string - collecton name
- internal_id: string - external id value
- external_id: string - external id value

**Response body:**
- none
