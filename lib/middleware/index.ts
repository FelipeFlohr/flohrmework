import { Request, Response, NextFunction } from "express";
import InvalidRoutePathError from "../errors/invalid_route_path_error";

export default abstract class FlohrmeworkMiddleware {
    public readonly path: string;

    public constructor(path: string) {
        this.path = FlohrmeworkMiddleware.parsePath(path);
    }

    public abstract use(req: Request, res: Response, next: NextFunction, err?: unknown): void;

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