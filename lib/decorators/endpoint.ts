import FlohrmeworkController from "../controller";
import FlohrmeworkControllerEndpoint from "../types/flohrmework_controller_endpoint";
import HttpMethod from "../enums/http_methods";
import NoMethodFoundError from "../errors/no_method_found_error";
import EndpointModel from "../models/endpoint_model";
import InvalidRoutePathError from "../errors/invalid_route_path_error";

/**
 * Endpoint decorator. Must be annotated
 * into controllers' methods.
 * @param method HTTP Method of the
 * endpoint.
 * @param path Path of the endpoint.
 * @throws InvalidRoutePathError if route
 * does not starts with "/".
 * @throws NoMethodFoundError if no method
 * was found in the place where the decorator
 * has been annotated.
 * 
 * @since 19/03/2023
 * @author Felipe Matheus Flohr
 */
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
    };
}