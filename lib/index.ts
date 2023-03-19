import { Request } from "express";
import FlohrmeworkController from "./controller";
import Endpoint from "./decorators/endpoint/endpoint";
import FlohrmeworkEndpointResponse from "./types/flohrmework_endpoint_response";
import HttpMethod from "./enums/http_methods";
import "reflect-metadata"

class ControllerTeste extends FlohrmeworkController {
    @Endpoint(HttpMethod.GET, "/testemetodo")
    public async teste(req: Request): Promise<FlohrmeworkEndpointResponse> {
        console.log("método chamado")
        return {
            code: 200,
        }
    }
}

new ControllerTeste()
