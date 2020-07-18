import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { DependencyResolver } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { IOpenable } from 'pip-services3-commons-node';

import { CompositeLogger } from 'pip-services3-components-node';
import { FixedRateTimer } from 'pip-services3-commons-node';

import { MappingV1 } from '../data/version1/MappingV1';
import { IMappingsPersistence } from '../persistence/IMappingsPersistence';
import { IMappingsController } from './IMappingsController';
import { MappingsCommandSet } from './MappingsCommandSet';

export class MappingsController implements IConfigurable, IReferenceable, ICommandable, IOpenable, IMappingsController {
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'pip-services-mappings:persistence:*:*:1.0'
    );

    private _dependencyResolver: DependencyResolver = new DependencyResolver(MappingsController._defaultConfig);
    private _persistence: IMappingsPersistence;
    private _commandSet: MappingsCommandSet;

    private _logger: CompositeLogger = new CompositeLogger();
    private _timer: FixedRateTimer = new FixedRateTimer();
    private _interval: number = 300000;

    public constructor() {}

    public configure(config: ConfigParams): void {
        this._logger.configure(config);
        this._dependencyResolver.configure(config);
        this._interval = config.getAsIntegerWithDefault("options.interval", this._interval);
    }

    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<IMappingsPersistence>("persistence");
    }

    public getCommandSet(): CommandSet {
        return this._commandSet || (this._commandSet = new MappingsCommandSet(this));
    }

    public isOpen(): boolean {
        return this._timer != null && this._timer.isStarted();
    }

    public open(correlationId: string, callback: (err: any) => void) {
        this._timer.setDelay(this._interval);
        this._timer.setInterval(this._interval);
        this._timer.setCallback(() => {
            this._logger.info(correlationId, 'Cleaning expired mappings.');
            this.deleteExpiredMappings(correlationId, (err) => {
                if (err)
                    this._logger.error(correlationId, err, 'Failed to clean expired mappings');
            });
        });
        this._timer.start();
        callback(null);
    }

    public close(correlationId: string, callback: (err: any) => any) {
        this._timer.stop();
        callback(null);
    }

    public getCollectionNames(correlationId: string, callback: (err: any, items: string[]) => void) {
        this._persistence.getCollectionNames(correlationId, callback);
    }

    public getMappings(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<MappingV1>) => void) {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public addMapping(correlationId: string, collection: string,
        internalId: string, externalId: string, timeToLive: number,
        callback: (err: any) => void) {
        this._persistence.createFromParams(correlationId, collection, internalId, externalId, timeToLive, callback);
    }

    public mapToExternal(correlationId: string, collection: string, internalId: string,
        callback: (err: any, externalId: string) => void) {
        this._persistence.getByInternalId(correlationId, collection, internalId, callback);
    }

    public mapToInternal(correlationId: string, collection: string, externalId: string, callback: (err: any, internalId: string) => void) {
        this._persistence.getByExternalId(correlationId, collection, externalId, callback);
    }

    public deleteMapping(correlationId: string, collection: string, internalId: string, externalId: string, callback: (err: any) => void) {
        this._persistence.delete(correlationId, collection, internalId, externalId, callback);
    }

    public deleteExpiredMappings(correlationId: string, callback: (err: any) => void) {
        this._persistence.deleteExpired(correlationId, callback);
    }
}

