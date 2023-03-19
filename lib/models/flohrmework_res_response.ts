import { Response } from "express";
import FlohrmeworkResponse from "./flohrmework_response";

export default class FlohrmeworkResResponse extends FlohrmeworkResponse {
    public readonly func: (res: Response) => Promise<void>;

    public constructor(func: (res: Response) => Promise<void>) {
        super();
        this.func = func;
    }
}