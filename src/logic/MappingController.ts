let async = require('async');

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

import { MappingV1 } from '../data/version1/MappingV1';
import { IMappingsPersistence } from '../persistence/IMappingsPersistence';
import { IMappingController } from './IMappingController';
import { MappingsCommandSet } from './MappingsCommandSet';
import { CompositeLogger, CompositeCounters, Timing } from 'pip-services3-components-node';


export class MappingController implements IConfigurable, IReferenceable, ICommandable, IMappingController {

    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'pip-services-mappings:persistence:*:*:1.0'
    );

    public readonly component: string = "Integration.MappingController";

    private _logger: CompositeLogger = new CompositeLogger();
    private _counters: CompositeCounters = new CompositeCounters();
    private _dependencyResolver: DependencyResolver = new DependencyResolver(MappingController._defaultConfig);
    private _persistence: IMappingsPersistence;
    private _commandSet: MappingsCommandSet;

    public constructor() {
        this._dependencyResolver = new DependencyResolver(
            ConfigParams.fromTuples("dependencies.persistence", "pip-services-mappings:persistence:*:*:1.0"));
    }

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<IMappingsPersistence>("persistence");
    }

    public getCommandSet(): CommandSet {
        return this._commandSet || (this._commandSet = new MappingsCommandSet(this));
    }


    protected instrument(correlationId: string, methodName: string, message: string): Timing {
        this._logger.trace(correlationId, "Executed %s.%s %s", this.component, methodName, message);
        return this._counters.beginTiming(this.component + "." + methodName + ".exec_time");
    }

    protected handleError(correlationId: string, methodName: string, ex: any): void {
        this._logger.error(correlationId, ex, "Failed to execute %s.%s", this.component, methodName);
    }


    getCollectionNames(correlationId: string, callback: (err: any, items: string[]) => void) {
        var time = this.instrument(correlationId, "getCollectionNames", "");
        this._persistence.getCollectionNames(correlationId, (err, items) => {
            time.endTiming();
            if (err) {
                this.handleError(correlationId, "getCollectionNames", err);
            }
            callback(err, items);
        });
    }


    getMappings(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<MappingV1>) => void) {
        var time = this.instrument(correlationId, "getMappings", "");
        this._persistence.getPageByFilter(correlationId, filter, paging, (err, page) => {
            time.endTiming();
            if (err) {
                this.handleError(correlationId, "getMappings", err);
            }
            callback(err, page);
        });
    }

    addMapping(correlationId: string, collection: string, internalId: string, externalId: string, timeToLive: number, callback: (err: any) => void) {
        var time = this.instrument(correlationId, "addMapping", "");
        this._persistence.createFromParams(correlationId, collection, internalId, externalId, timeToLive, (err, item) => {
            time.endTiming();
            if (err) {
                this.handleError(correlationId, "addMapping", err);
            }
            callback(err);

        });
    }


    mapToExternal(correlationId: string, collection: string, internalId: string, callback: (err: any, externalId: string) => void) {
        var time = this.instrument(correlationId, "mapToExternal", "");
        this._persistence.getByInternalId(correlationId, collection, internalId, (err, id) => {
            time.endTiming();
            if (err) {
                this.handleError(correlationId, "mapToExternal", err);
            }
            callback(err, id);
        });
    }

    mapToInternal(correlationId: string, collection: string, externalId: string, callback: (err: any, internalId: string) => void) {
        var time = this.instrument(correlationId, "mapToInternal", "");
        this._persistence.getByExternalId(correlationId, collection, externalId, (err, id) => {
            time.endTiming();
            if (err) {
                this.handleError(correlationId, "mapToInternal", err);
            }
            callback(err, id);
        });
    }

    deleteMapping(correlationId: string, collection: string, internalId: string, externalId: string, callback: (err: any) => void) {
        var time = this.instrument(correlationId, "deleteMapping", "");
        this._persistence.delete(correlationId, collection, internalId, externalId, (err) => {
            time.endTiming();
            if (err) {
                this.handleError(correlationId, "deleteMapping", err);
            }
            callback(err);
        });
    }

    deleteExpiredMappings(correlationId: string, callback: (err: any) => void) {
        var time = this.instrument(correlationId, "deleteExpiredMappings", "");
        this._persistence.deleteExpired(correlationId, (err) => {
            time.endTiming();
            if (err) {
                this.handleError(correlationId, "deleteExpiredMappings", err);
            }
            callback(err);
        });
    }
}

