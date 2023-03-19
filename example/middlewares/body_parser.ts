import bodyParser from "body-parser";
import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { FlohrmeworkMiddleware } from "../../lib";

export default class BodyParserMiddleware extends FlohrmeworkMiddleware {
    public constructor() {
        super();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public use(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction): void {
        const instance = bodyParser.json();
        console.log("Middleware called");
        instance(req, res, next);
    }
}