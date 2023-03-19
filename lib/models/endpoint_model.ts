import HttpMethod from "../enums/http_methods";
import FlohrmeworkControllerEndpoint from "../types/flohrmework_controller_endpoint"

export default class EndpointModel {
    public readonly path: string
    public readonly method: HttpMethod
    public readonly func: FlohrmeworkControllerEndpoint

    public constructor(path: string, method: HttpMethod, func: FlohrmeworkControllerEndpoint) {
        this.path = path;
        this.method = method;
        this.func = func;
    }
}