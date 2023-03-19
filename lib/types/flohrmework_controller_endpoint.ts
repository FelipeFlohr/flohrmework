import { NextFunction, Request } from "express";
import FlohrmeworkEndpointResponse from "./flohrmework_endpoint_response";

type FlohrmeworkControllerEndpoint = (req: Request, next?: NextFunction) => Promise<FlohrmeworkEndpointResponse>;

export default FlohrmeworkControllerEndpoint;