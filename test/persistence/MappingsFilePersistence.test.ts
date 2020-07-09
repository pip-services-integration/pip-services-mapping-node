// import { ConfigParams } from 'pip-services3-commons-node';

// import { MappingsFilePersistence } from '../../src/persistence/MappingsFilePersistence';
// import { MappingsPersistenceFixture } from './MappingsPersistenceFixture';

// suite('MappingsFilePersistence', ()=> {
//     let persistence: MappingsFilePersistence;
//     let fixture: MappingsPersistenceFixture;
    
//     setup((done) => {
//         persistence = new MappingsFilePersistence('./data/mappings.test.json');

//         fixture = new MappingsPersistenceFixture(persistence);

//         persistence.open(null, (err) => {
//             persistence.clear(null, done);
//         });
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