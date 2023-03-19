import { Response } from "express";
import FlohrmeworkResponse from "./flohrmework_response";

/**
 * Response of a controller endpoint
 * using Express' response object.
 * 
 * @since 19/03/2023
 * @author Felipe Matheus Flohr
 */
export default class FlohrmeworkResResponse extends FlohrmeworkResponse {
    public readonly func: (res: Response) => Promise<void>;

    public constructor(func: (res: Response) => Promise<void>) {
        super();
        this.func = func;
    }
}