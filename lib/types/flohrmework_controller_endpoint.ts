import { NextFunction, Request } from "express";
import FlohrmeworkResponse from "../models/flohrmework_response";

type FlohrmeworkControllerEndpoint = (req: Request, next?: NextFunction) => Promise<FlohrmeworkResponse>;

export default FlohrmeworkControllerEndpoint;