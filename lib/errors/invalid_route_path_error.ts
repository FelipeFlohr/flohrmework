export default class InvalidRoutePathError extends Error {
    public constructor(route: string) {
        super(`Route ${route} is not a valid route.`);
    }
}