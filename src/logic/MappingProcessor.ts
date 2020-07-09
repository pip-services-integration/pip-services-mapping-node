import { ConfigParams, FixedRateTimer, IConfigurable, IReferenceable, IOpenable, IReferences, Descriptor } from "pip-services3-commons-node";
import { CompositeLogger } from "pip-services3-components-node";
import { IMappingController } from "./IMappingController";
import { Parameters } from "pip-services3-commons-node";


export class MappingProcessor implements IConfigurable, IReferenceable, IOpenable {
    private _logger: CompositeLogger = new CompositeLogger();
    private _timer: FixedRateTimer = new FixedRateTimer();
    private _controller: IMappingController;
    private _correlationId: string = "Integration.Mapping";
    private _interval: number = 300000;

    public constructor() {

    }

    public configure(config: ConfigParams): void {
        this._logger.configure(config);
        this._interval = config.getAsIntegerWithDefault("options.interval", this._interval);
    }

    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
        this._controller = references.getOneRequired<IMappingController>(new Descriptor("pip-services-mappings", "controller", "default", "*", "1.0"));
    }

    public open(correlationId: string, callback: (err: any) => void) {
        this._timer.setDelay(this._interval);
        this._timer.setInterval(this._interval);
        this._timer.setTask({
            notify: (correlationId: string, args: Parameters) => {
                this._deleteExpiredMappings();
            }
        });
        this._timer.start();
        callback(null);
    }

    public close(correlationId: string, callback: (err: any) => any) {
        this._timer.stop();
        callback(null);
    }

    public isOpen(): boolean {
        return this._timer != null && this._timer.isStarted();
    }

    private _deleteExpiredMappings(): void {
        this._timer.stop();

        this._logger.info(this._correlationId, "Deleting expired mappings...");

        this._controller.deleteExpiredMappings(this._correlationId, (err) => {
            this._logger.info(this._correlationId, "Expired mappings deleted.");
            this._timer.start();
        });

    }
}
