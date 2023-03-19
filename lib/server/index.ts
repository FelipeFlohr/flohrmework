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
import IEndpointRepository from "../decorators/endpoint/endpoint_repository/endpoint_repository";
import HttpMethod from "../enums/http_methods";

export default class Server {
    protected readonly app: Express;
    private readonly _controllers: Array<FlohrmeworkControllerCreation>;
    private readonly _middlewares: Array<FlohrmeworkMiddlewareCreation>;
    private readonly port: number;
    private readonly hostname?: string;
    private readonly logger: Logger;
    private readonly endpointRepository: IEndpointRepository;
    private server?: ServerType<typeof IncomingMessage, typeof ServerResponse>

    public constructor(properties: ServerProperties) {
        this.app = express();
        this._controllers = properties.controllers;
        this._middlewares = properties.middlewares;
        this.hostname = properties.hostname;
        this.port = properties.port;
        this.logger = container.get(TYPES.Logger);
        this.endpointRepository = container.get<IEndpointRepository>(TYPES.EndpointRepository);

        this.setupMiddlewares();
        this.setupControllers();
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
            const endpoints = this.endpointRepository.getEndpoints();

            for (const endpoint of endpoints) {
                const func = async (req: Request, res: Response, next: NextFunction) => {
                    const wrappedFunction = this.wrapControllerFunction(endpoint.func)
                    const result = await wrappedFunction(req, next);

                    res.status(result.code).json(result);
                }

                const method = endpoint.method;
                switch(method) {
                    case HttpMethod.CONNECT:
                        this.app.connect(endpoint.path, func)
                        break;
                    case HttpMethod.DELETE:
                        this.app.delete(endpoint.path, func)
                        break;
                    case HttpMethod.GET:
                        this.app.get(endpoint.path, func)
                        break;
                    case HttpMethod.HEAD:
                        this.app.head(endpoint.path, func)
                        break;
                    case HttpMethod.OPTIONS:
                        this.app.options(endpoint.path, func)
                        break;
                    case HttpMethod.PATCH:
                        this.app.patch(endpoint.path, func)
                        break;
                    case HttpMethod.POST:
                        this.app.post(endpoint.path, func)
                        break;
                    case HttpMethod.PUT:
                        this.app.put(endpoint.path, func)
                        break;
                    case HttpMethod.TRACE:
                        this.app.trace(endpoint.path, func)
                        break;
                }
            }
        } catch (err) {
            if (err instanceof Error) {
                this.logger.fatal(`Middleware setup failed: ${err.message} | Stack: ${err.stack}`)
            } else {
                this.logger.fatal(`Middleware setup failed: ${err}`)
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
