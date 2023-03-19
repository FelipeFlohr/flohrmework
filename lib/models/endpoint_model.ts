import HttpMethod from "../enums/http_methods";
import FlohrmeworkControllerEndpoint from "../types/flohrmework_controller_endpoint";

/**
 * Endpoint data saved in the
 * decorator metadata.
 * 
 * @since 19/03/2023
 * @author Felipe Matheus Flohr
 */
export default class EndpointModel {
    public readonly path: string;
    public readonly method: HttpMethod;
    public readonly func: FlohrmeworkControllerEndpoint;

    public constructor(path: string, method: HttpMethod, func: FlohrmeworkControllerEndpoint) {
        this.path = path;
        this.method = method;
        this.func = func;
    }
}