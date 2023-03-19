import HttpMethod from "../../../enums/http_methods";
import EndpointModel from "../../../models/endpoint_model";
import FlohrmeworkControllerEndpoint from "../../../types/flohrmework_controller_endpoint";

interface IEndpointRepository {
    getEndpoints(): EndpointModel[]
    addEndpoint(path: string, method: HttpMethod, func: FlohrmeworkControllerEndpoint): void
}

export default IEndpointRepository;