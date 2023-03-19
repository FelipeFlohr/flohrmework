/**
 * Error thrown when there is a tentative of closing the
 * server when it's already closed.
 * 
 * @since 19/03/2023
 * @author Felipe Matheus Flohr
 */
export default class ServerNotRunningError extends Error {
    public constructor() {
        super("Server is not running.");
    }
}