import { Request, Response, NextFunction } from "express";
import InvalidRoutePathError from "../errors/invalid_route_path_error";

/**
 * Parent class of a middlware.
 * Defines the middleware path
 * and behaviour.
 * 
 * @since 19/03/2023
 * @author Felipe Matheus Flohr
 */
export default abstract class FlohrmeworkMiddleware {
    /**
     * Middleware path.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    public readonly path?: string;

    /**
     * Constructor of the middleware.
     * @param path Path of the middleware.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    public constructor(path?: string) {
        if (path) {
            this.path = FlohrmeworkMiddleware.parsePath(path);
        }
    }

    /**
     * Method implemented that defines
     * the middleware behaviour.
     * @param req Express' request object.
     * @param res Express' response object.
     * @param next Express' next function.
     * @param err Error object that can be
     * passed in the "next" function.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    public abstract use(req: Request, res: Response, next: NextFunction, err?: unknown): void;

    /**
     * Parses the middleware path.
     * @param path Middleware path.
     * @returns Parsed middleware
     * path.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    private static parsePath(path: string): string {
        if (!path.startsWith("/")) {
            throw new InvalidRoutePathError(path);
        }

        path = path.trim();
        return path.endsWith("/")
            ? path.substring(0, path.length - 1)
            : path;
    }
}