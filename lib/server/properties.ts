import FlohrmeworkControllerCreation from "../types/flohrmework_controller_creation";
import FlohrmeworkMiddlewareCreation from "../types/flohrmework_middleware_creation";

/**
 * Server properties.
 * 
 * @since 19/03/2023
 * @author Felipe Matheus Flohr
 */
type ServerProperties = {
    /**
     * Port of the server.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    readonly port: number
    /**
     * Hostname of the server.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    readonly hostname?: string
    /**
     * Controller instances.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    readonly controllers: Array<FlohrmeworkControllerCreation>
    /**
     * Middleware instances.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    readonly middlewares: Array<FlohrmeworkMiddlewareCreation>
}

export default ServerProperties;