import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { MappingsMongoDbPersistence } from '../persistence/MappingsMongoDbPersistence';
import { MappingsFilePersistence } from '../persistence/MappingsFilePersistence';
import { MappingsMemoryPersistence } from '../persistence/MappingsMemoryPersistence';
import { MappingsController } from '../logic/MappingsController';
import { MappingsHttpServiceV1 } from '../services/version1/MappingsHttpServiceV1';

export class MappingsServiceFactory extends Factory {
	public static Descriptor = new Descriptor("pip-services-mappings", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("pip-services-mappings", "persistence", "memory", "*", "1.0");
	public static FilePersistenceDescriptor = new Descriptor("pip-services-mappings", "persistence", "file", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("pip-services-mappings", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("pip-services-mappings", "controller", "default", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("pip-services-mappings", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(MappingsServiceFactory.MemoryPersistenceDescriptor, MappingsMemoryPersistence);
		this.registerAsType(MappingsServiceFactory.FilePersistenceDescriptor, MappingsFilePersistence);
		this.registerAsType(MappingsServiceFactory.MongoDbPersistenceDescriptor, MappingsMongoDbPersistence);
		this.registerAsType(MappingsServiceFactory.ControllerDescriptor, MappingsController);
		this.registerAsType(MappingsServiceFactory.HttpServiceDescriptor, MappingsHttpServiceV1);
	}
	
}
