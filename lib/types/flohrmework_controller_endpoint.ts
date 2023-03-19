import { NextFunction, Request } from "express";
import FlohrmeworkResponse from "../models/flohrmework_response";

/**
 * Type of the method in which the
 * endpoint decorator will be annotated.
 * 
 * @since 19/03/2023
 * @author Felipe Matheus Flohr
 */
type FlohrmeworkControllerEndpoint = (req: Request, next?: NextFunction) => Promise<FlohrmeworkResponse>;

export default FlohrmeworkControllerEndpoint;