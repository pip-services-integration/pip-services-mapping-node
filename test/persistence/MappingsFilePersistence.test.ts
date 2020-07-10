import { ConfigParams } from 'pip-services3-commons-node';

import { MappingsFilePersistence } from '../../src/persistence/MappingsFilePersistence';
import { MappingsPersistenceFixture } from './MappingsPersistenceFixture';

suite('MappingsFilePersistence', () => {
    let persistence: MappingsFilePersistence;
    let fixture: MappingsPersistenceFixture;

    setup((done) => {
        persistence = new MappingsFilePersistence('./data/mappings.test.json');

        fixture = new MappingsPersistenceFixture(persistence);

        persistence.open(null, (err) => {
            persistence.clear(null, done);
        });
    });

    teardown((done) => {
        persistence.close(null, done);
    });

    test('Mapping collections', (done) => {
        fixture.testGetMappingCollections(done);
    });

    test('Get Mappings', (done) => {
        fixture.testGetMappings(done);
    });

    test('Mappings', (done) => {
        fixture.testMapping(done);
    });

    test('Expired Mappings', (done) => {
        fixture.testExpiredMappings(done);
    });

});