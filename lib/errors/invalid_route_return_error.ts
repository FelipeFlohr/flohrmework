export default class InvalidRouteReturnError extends Error {
    public constructor(routePath: string) {
        super(`Invalid instance returned in the route of path ${routePath}. Instance must be of "FlohrmeworkDataResponse" or "FlohrmeworkResResponse".`);
    }
}