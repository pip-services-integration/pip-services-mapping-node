// import { ConfigParams } from 'pip-services3-commons-node';

// import { MappingsMemoryPersistence } from '../../src/persistence/MappingsMemoryPersistence';
// import { MappingsPersistenceFixture } from './MappingsPersistenceFixture';

// suite('MappingsMemoryPersistence', ()=> {
//     let persistence: MappingsMemoryPersistence;
//     let fixture: MappingsPersistenceFixture;
    
//     setup((done) => {
//         persistence = new MappingsMemoryPersistence();
//         persistence.configure(new ConfigParams());
        
//         fixture = new MappingsPersistenceFixture(persistence);
        
//         persistence.open(null, done);
//     });
    
//     teardown((done) => {
//         persistence.close(null, done);
//     });
        
//     test('CRUD Operations', (done) => {
//         fixture.testCrudOperations(done);
//     });

//     test('Get with Filters', (done) => {
//         fixture.testGetWithFilter(done);
//     });

// });