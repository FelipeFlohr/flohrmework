import { Container } from "@felipeflohr/flohr-common-injection";
import Logger from "../logger";
import TYPES from "./types";
import IEndpointRepository from "../decorators/endpoint/endpoint_repository/endpoint_repository";
import EndpointRepositoryImpl from "../decorators/endpoint/endpoint_repository/impl/endpoint_repository_impl";

const container = new Container();

container.bind<Logger>(TYPES.Logger).toSingleton(Logger);
container.bind<IEndpointRepository>(TYPES.EndpointRepository).toSingleton(EndpointRepositoryImpl);

export default container;