import FlohrmeworkController from "../../controller"
import FlohrmeworkControllerEndpoint from "../../types/flohrmework_controller_endpoint"
import HttpMethod from "../../enums/http_methods"
import container from "../../container"
import TYPES from "../../container/types"
import NoMethodFoundError from "../../errors/no_method_found"
import IEndpointRepository from "./endpoint_repository/endpoint_repository"

const endpointRepository = container.get<IEndpointRepository>(TYPES.EndpointRepository);

export default function Endpoint(method: HttpMethod, path: string) {
    return function(target: FlohrmeworkController, key: string | symbol, descriptor: TypedPropertyDescriptor<FlohrmeworkControllerEndpoint>) {
        if (descriptor.value) {
            endpointRepository.addEndpoint(path, method, descriptor.value)
        } else {
            throw new NoMethodFoundError(key.toString());
        }
    }
}