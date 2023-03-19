export default class ServerNotRunningError extends Error {
    public constructor() {
        super("Server is not running.")
    }
}