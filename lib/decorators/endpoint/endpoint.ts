import FlohrmeworkController from "../../controller"
import FlohrmeworkControllerEndpoint from "../../types/flohrmework_controller_endpoint"
import HttpMethod from "../../enums/http_methods"
import NoMethodFoundError from "../../errors/no_method_found"
import EndpointModel from "../../models/endpoint_model"
import InvalidRoutePathError from "../../errors/invalid_route_path_error"

export default function Endpoint(method: HttpMethod, path: string) {
    if (!path.startsWith("/")) {
        throw new InvalidRoutePathError(path);
    }

    return function(target: FlohrmeworkController, key: string | symbol, descriptor: TypedPropertyDescriptor<FlohrmeworkControllerEndpoint>) {
        if (descriptor.value) {
            Reflect.defineMetadata(`FLOHRMEWORK_ENDPOINT_${key.toString()}`, new EndpointModel(path, method, descriptor.value), target);
        } else {
            throw new NoMethodFoundError(key.toString());
        }
    }
}