import HttpMethod from "../enums/http_methods";
import Endpoint from "./endpoint";

/**
 * Endpoint decorator using the "GET"
 * HTTP method.
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
export default function Get(path: string) {
    return Endpoint(HttpMethod.GET, path);
}