import type { Express, NextFunction, Request, Response } from "express";
import type { Server as ServerType, IncomingMessage, ServerResponse } from "http";
import type FlohrmeworkControllerCreation from "../types/flohrmework_controller_creation";
import type FlohrmeworkMiddlewareCreation from "../types/flohrmework_middleware_creation";
import type ServerProperties from "./properties";
import type FlohrmeworkControllerEndpoint from "../types/flohrmework_controller_endpoint";
import type { FlohrmeworkEndpointReturnData } from "../models/flohrmework_data_response";
import express from "express";
import Logger from "../logger";
import container from "../container";
import TYPES from "../container/types";
import ServerNotRunningError from "../errors/server_not_running_error";
import EndpointModel from "../models/endpoint_model";
import InvalidRoutePathError from "../errors/invalid_route_path_error";
import FlohrmeworkDataResponse from "../models/flohrmework_data_response";
import FlohrmeworkResResponse from "../models/flohrmework_res_response";
import InvalidRouteReturnError from "../errors/invalid_route_return_error";
import attachEndpointToApplication from "./handlers/attach_endpoint_to_application";

/**
 * Flohrmework Server.
 * 
 * @since 19/03/2023
 * @author Felipe Matheus Flohr
 */
export default class Server {
    /**
     * Express.js application.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    protected readonly app: Express;
    /**
     * Controllers attached.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    private readonly _controllers: Array<FlohrmeworkControllerCreation>;
    /**
     * Middlewares attached.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    private readonly _middlewares: Array<FlohrmeworkMiddlewareCreation>;
    /**
     * Port of the server.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    private readonly port: number;
    /**
     * Hostname of the server.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    private readonly hostname?: string;
    /**
     * Logger of the application.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    private readonly logger: Logger;
    /**
     * Node.js server instance.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    private server?: ServerType<typeof IncomingMessage, typeof ServerResponse>;

    /**
     * Constructor of the server.
     * @param properties Server properties.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
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

    /**
     * Returns an array copy of
     * the controllers attached.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    public get controllers(): Array<FlohrmeworkControllerCreation> {
        return [...this._controllers];
    }

    /**
     * Returns an array copy of
     * the middlewares attached.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    public get middlewares(): Array<FlohrmeworkMiddlewareCreation> {
        return [...this._middlewares];
    }

    /**
     * Starts the server.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    public async listen(): Promise<void> {
        const server = await this.promisifyServerListen();
        this.logger.okay(`Listening on port ${this.port}.`);
        this.server = server;
    }

    /**
     * Closes the server.
     * @throws ServerNotRunningError if
     * the server is not running.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    public close(): Promise<void> {
        return new Promise<void>((res, rej) => {
            if (this.server) {
                this.server.close((err) => {
                    if (err) {
                        rej(err);
                    } else {
                        res();
                    }
                });
            } else {
                rej(new ServerNotRunningError());
            }
        });
    }

    /**
     * Setup the middlewares.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    private setupMiddlewares(): void {
        try {
            this.logger.info("Setting up the middlewares...");

            for (const middlewareCreation of this.middlewares) {
                const middleware = middlewareCreation();

                if (middleware.path) {
                    this.app.use(middleware.path, middleware.use);
                } else {
                    this.app.use(middleware.use);
                }

                this.logger.info(
                    `Middleware set up for path ${middleware.path}.`
                );
            }

            this.logger.okay("All middlewares have been set up.");
        } catch (err) {
            if (err instanceof Error) {
                this.logger.fatal(`Middleware setup failed: ${err.message} | Stack: ${err.stack}`);
            } else {
                this.logger.fatal(`Middleware setup failed: ${err}`);
            }

            throw err;
        }
    }

    /**
     * Setup the controllers.
     * @throws InvalidRoutePathError if
     * some route path is invalid.
     * @throws InvalidRouteReturnError if
     * some return type of an endpoint is
     * invalid.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    private setupControllers(): void {
        try {
            this.logger.info("Setting up controllers...");
            for (const controller of this.controllers) {
                const instance = controller();

                if (!instance.path.startsWith("/")) {
                    throw new InvalidRoutePathError(instance.path);
                }

                this.logger.info(`Setting the routes for path ${instance.path}.`);

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
                    const path = `${controllerPath}${endpointPath}`;
                    
                    const expressFunction = async (req: Request, res: Response, next: NextFunction) => {
                        const endpointFunc = this.wrapControllerFunction(endpoint.func);
                        const wrapRes = await endpointFunc(req, next);

                        if (wrapRes instanceof FlohrmeworkDataResponse) {
                            res.status(wrapRes.data.code).json(wrapRes.data);
                        } else if (wrapRes instanceof FlohrmeworkResResponse) {
                            try {
                                await wrapRes.func(res);
                            } catch (err) {
                                const error = this.handleUncaughtApiError(err, wrapRes.func);
                                res.status(error.code).json(error);
                            }
                        } else {
                            throw new InvalidRouteReturnError(path);
                        }
                    };

                    const method = endpoint.method;
                    attachEndpointToApplication(method, this.app, path, expressFunction);
                }
            }

            this.logger.okay("All controllers have been set up.");
        } catch (err) {
            if (err instanceof Error) {
                this.logger.fatal(`Controller setup failed: ${err.message} | Stack: ${err.stack}`);
            } else {
                this.logger.fatal(`Controller setup failed: ${err}`);
            }
        }
    }

    /**
     * Wraps a controller function with try/catch.
     * @param func Function to wrap.
     * @returns Wrapped function.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    private wrapControllerFunction(func: FlohrmeworkControllerEndpoint): FlohrmeworkControllerEndpoint {
        const res = async (req: Request, next?: NextFunction) => {
            try {
                return await func(req, next);
            } catch (err) {
                return this.handleUncaughtApiError(err, func);
            }
        };

        return res;
    }

    /**
     * Handles an uncaught API error.
     * @param err Error thrown
     * @param func Function which the
     * error was thrown.
     * @returns Endpoint return data
     * with status code 500.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private handleUncaughtApiError(err: unknown, func: (...args: any[]) => any): FlohrmeworkEndpointReturnData {
        const message = err instanceof Error ? `INTERNAL_SERVER_ERROR: ${err.message}` : "INTERNAL_SERVER_ERROR";
        const res: FlohrmeworkEndpointReturnData = {
            code: 500,
            message: message
        };

        err instanceof Error
            ? this.logger.error(`An uncaught error was thrown in the ${func.name} method: ${err.message} | Stack: ${err.stack}`)
            : this.logger.error(`An uncaught error was thrown in the ${func.name} method: ${err}`);

        return res;
    }

    /**
     * Promisifies the server opening.
     * @returns Node.js server instance.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    private promisifyServerListen(): Promise<ServerType<typeof IncomingMessage, typeof ServerResponse>> {
        return new Promise<ServerType<typeof IncomingMessage, typeof ServerResponse>>((res, rej) => {
            try {
                if (this.hostname) {
                    const server = this.app.listen(this.port, this.hostname, () => {
                        res(server);
                    });
                } else {
                    const server = this.app.listen(this.port, () => {
                        res(server);
                    });
                }
            } catch (err) {
                rej(err);
            }
        });
    }
}
