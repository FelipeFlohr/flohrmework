// import { Request } from "express";
// import FlohrmeworkController from "./controller";
// import Endpoint from "./decorators/endpoint/endpoint";
// import FlohrmeworkEndpointResponse from "./types/flohrmework_endpoint_response";
// import HttpMethod from "./enums/http_methods";
// import "reflect-metadata"
// import Server from "./server";

// class ControllerTeste extends FlohrmeworkController {
//     public override readonly path: string = "/"

//     @Endpoint(HttpMethod.GET, "/testemetodo")
//     public async teste(req: Request): Promise<FlohrmeworkEndpointResponse> {
//         console.log("método chamado")
//         return {
//             code: 200,
//         }
//     }
// }

// const server = new Server({ controllers: [() => new ControllerTeste()], middlewares: [], port: 3030 })
// server.listen();
