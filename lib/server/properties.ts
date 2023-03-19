import FlohrmeworkControllerCreation from "../types/flohrmework_controller_creation";
import FlohrmeworkMiddlewareCreation from "../types/flohrmework_middleware_creation";

type ServerProperties = {
    readonly port: number
    readonly hostname?: string
    readonly controllers: Array<FlohrmeworkControllerCreation>
    readonly middlewares: Array<FlohrmeworkMiddlewareCreation>
}

export default ServerProperties;