/**
 * Error thrown when a route returns an invalid type.
 * 
 * @since 19/03/2023
 * @author Felipe Matheus Flohr
 */
export default class InvalidRouteReturnError extends Error {
    public constructor(routePath: string) {
        super(`Invalid instance returned in the route of path ${routePath}. Instance must be of "FlohrmeworkDataResponse" or "FlohrmeworkResResponse".`);
    }
}