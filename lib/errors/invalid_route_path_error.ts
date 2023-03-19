/**
 * Error thrown when a route path is invalid.
 * 
 * @since 19/03/2023
 * @author Felipe Matheus Flohr
 */
export default class InvalidRoutePathError extends Error {
    public constructor(route: string) {
        super(`Route ${route} is not a valid route.`);
    }
}