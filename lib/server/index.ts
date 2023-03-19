import type { Express, NextFunction, Request, Response } from "express";
import express from "express";
import FlohrmeworkControllerCreation from "../types/flohrmework_controller_creation";
import FlohrmeworkMiddlewareCreation from "../types/flohrmework_middleware_creation";
import ServerProperties from "./properties";
import Logger from "../logger";
import container from "../container";
import TYPES from "../container/types";
import { Server as ServerType, IncomingMessage, ServerResponse } from "http";
import ServerNotRunningError from "../errors/server_not_running_error";
import FlohrmeworkControllerEndpoint from "../types/flohrmework_controller_endpoint";
import FlohrmeworkEndpointResponse from "../types/flohrmework_endpoint_response";
import EndpointModel from "../models/endpoint_model";
import InvalidRoutePathError from "../errors/invalid_route_path_error";
import HttpMethod from "../enums/http_methods";

export default class Server {
    protected readonly app: Express;
    private readonly _controllers: Array<FlohrmeworkControllerCreation>;
    private readonly _middlewares: Array<FlohrmeworkMiddlewareCreation>;
    private readonly port: number;
    private readonly hostname?: string;
    private readonly logger: Logger;
    private server?: ServerType<typeof IncomingMessage, typeof ServerResponse>

    public constructor(properties: ServerProperties) {
        this.app = express();
        this._controllers = properties.controllers;
        this._middlewares = properties.middlewares;
        this.hostname = properties.hostname;
        this.port = properties.port;
        this.logger = container.get(TYPES.Logger);

        this.setupMiddlewares();
        this.setupControllers();
        this.logger.info("Waiting for listen call...");
    }

    public get controllers(): Array<FlohrmeworkControllerCreation> {
        return [...this._controllers];
    }

    public get middlewares(): Array<FlohrmeworkMiddlewareCreation> {
        return [...this._middlewares];
    }

    public async listen(): Promise<void> {
        const server = await this.promisifyServerListen()
        this.logger.okay(`Listening on port ${this.port}.`)
        this.server = server;
    }

    public close(): Promise<void> {
        return new Promise<void>((res, rej) => {
            if (this.server) {
                this.server.close((err) => {
                    if (err) {
                        rej(err)
                    } else {
                        res()
                    }
                })
            } else {
                rej(new ServerNotRunningError())
            }
        })
    }

    private setupMiddlewares(): void {
        try {
            this.logger.info("Setting up the middlewares...");

            for (const middlewareCreation of this.middlewares) {
                const middleware = middlewareCreation();
                this.app.use(middleware.path, middleware.use);
                this.logger.info(
                    `Middleware set up for path ${middleware.path}.`
                );
            }

            this.logger.okay("All middlewares have been set up.");
        } catch (err) {
            if (err instanceof Error) {
                this.logger.fatal(`Middleware setup failed: ${err.message} | Stack: ${err.stack}`)
            } else {
                this.logger.fatal(`Middleware setup failed: ${err}`)
            }

            throw err;
        }
    }

    private setupControllers(): void {
        try {
            this.logger.info("Setting up controllers...")
            for (const controller of this.controllers) {
                const instance = controller()

                if (!instance.path.startsWith("/")) {
                    throw new InvalidRoutePathError(instance.path);
                }

                this.logger.info(`Setting the routes for path ${instance.path}.`)

                const endpoints: EndpointModel[] = Reflect.getMetadataKeys(instance)
                    .map(k => {
                        if (typeof k !== "string") {
                            return undefined;
                        }
                        return k;
                    })
                    .filter(k => k !== undefined)
                    .filter(k => k?.startsWith("FLOHRMEWORK_ENDPOINT"))
                    .map(k => {
                        return Reflect.getMetadata(k, instance);
                    })
                    .filter(o => o instanceof EndpointModel);

                for (const endpoint of endpoints) {
                    const controllerPath = instance.path.endsWith("/")
                        ? instance.path.substring(0, instance.path.length - 1)
                        : instance.path;
                    const endpointPath = endpoint.path.endsWith("/")
                        ? endpoint.path.substring(0, endpoint.path.length - 1)
                        : endpoint.path;
                    const path = `${controllerPath}${endpointPath}`

                    const expressFunction = async (req: Request, res: Response, next: NextFunction) => {
                        const wrappedFunction = this.wrapControllerFunction(endpoint.func);
                        const wrapRes = await wrappedFunction(req, next);

                        res.status(wrapRes.code).json(wrapRes);
                    }

                    const method = endpoint.method;
                    switch (method) {
                        case HttpMethod.CONNECT:
                            this.app.connect(path, expressFunction);
                            break;
                        case HttpMethod.DELETE:
                            this.app.delete(path, expressFunction);
                            break;
                        case HttpMethod.GET:
                            this.app.get(path, expressFunction);
                            break;
                        case HttpMethod.HEAD:
                            this.app.head(path, expressFunction);
                            break;
                        case HttpMethod.OPTIONS:
                            this.app.options(path, expressFunction);
                            break;
                        case HttpMethod.PATCH:
                            this.app.patch(path, expressFunction);
                            break;
                        case HttpMethod.POST:
                            this.app.post(path, expressFunction);
                            break;
                        case HttpMethod.PUT:
                            this.app.put(path, expressFunction);
                            break;
                        case HttpMethod.TRACE:
                            this.app.trace(path, expressFunction);
                            break;
                    }
                }
            }
 
            this.logger.okay("All controllers have been set up.");
        } catch (err) {
            if (err instanceof Error) {
                this.logger.fatal(`Controller setup failed: ${err.message} | Stack: ${err.stack}`)
            } else {
                this.logger.fatal(`Controller setup failed: ${err}`)
            }
        }
    }
    
    private wrapControllerFunction(func: FlohrmeworkControllerEndpoint): FlohrmeworkControllerEndpoint {
        const res = async (req: Request, next?: NextFunction) => {
            try {
                return await func(req, next);
            } catch (err) {
                const message = err instanceof Error ? `INTERNAL_SERVER_ERROR: ${err.message}` : "INTERNAL_SERVER_ERROR"
                const res: FlohrmeworkEndpointResponse = {
                    code: 500,
                    message: message
                }

                err instanceof Error
                    ? this.logger.error(`An uncaught error was thrown in the ${func.name} method: ${err.message} | Stack: ${err.stack}`)
                    : this.logger.error(`An uncaught error was thrown in the ${func.name} method: ${err}`);

                return res;
            }
        }

        return res;
    }

    private promisifyServerListen(): Promise<ServerType<typeof IncomingMessage, typeof ServerResponse>> {
        return new Promise<ServerType<typeof IncomingMessage, typeof ServerResponse>>((res, rej) => {
            try {
                if (this.hostname) {
                    const server = this.app.listen(this.port, this.hostname, () => {
                        res(server);
                    })
                } else {
                    const server = this.app.listen(this.port, () => {
                        res(server)
                    })
                }
            } catch (err) {
                rej(err)
            }
        })
    }
}
