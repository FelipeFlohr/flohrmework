import HttpMethod from "../../enums/http_methods";
import type { Express, NextFunction, Request, Response } from "express";

/**
 * Attaches a function to
 * an endpoint.
 * @param method HTTP Method.
 * @param app Express application.
 * @param path Path of the endpoint.
 * @param expressFunction Express
 * function to attach.
 * 
 * @since 19/03/2023
 * @author Felipe Matheus Flohr
 */
export default function attachEndpointToApplication(
    method: HttpMethod,
    app: Express,
    path: string,
    expressFunction: (
        req: Request,
        res: Response,
        next: NextFunction
    ) => Promise<void>
): void {
    switch (method) {
        case HttpMethod.CONNECT:
            app.connect(path, expressFunction);
            break;
        case HttpMethod.DELETE:
            app.delete(path, expressFunction);
            break;
        case HttpMethod.GET:
            app.get(path, expressFunction);
            break;
        case HttpMethod.HEAD:
            app.head(path, expressFunction);
            break;
        case HttpMethod.OPTIONS:
            app.options(path, expressFunction);
            break;
        case HttpMethod.PATCH:
            app.patch(path, expressFunction);
            break;
        case HttpMethod.POST:
            app.post(path, expressFunction);
            break;
        case HttpMethod.PUT:
            app.put(path, expressFunction);
            break;
        case HttpMethod.TRACE:
            app.trace(path, expressFunction);
            break;
    }
}
