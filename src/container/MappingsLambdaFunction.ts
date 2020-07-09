// import { Descriptor } from 'pip-services3-commons-node';
// import { CommandableLambdaFunction } from 'pip-services3-aws-node';
// import { MappingsServiceFactory } from '../build/MappingsServiceFactory';

// export class MappingsLambdaFunction extends CommandableLambdaFunction {
//     public constructor() {
//         super("mappings", "Mappings function");
//         this._dependencyResolver.put('controller', new Descriptor('pip-services-mappings', 'controller', 'default', '*', '*'));
//         this._factories.add(new MappingsServiceFactory());
//     }
// }

// export const handler = new MappingsLambdaFunction().getHandler();