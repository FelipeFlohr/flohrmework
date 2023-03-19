import FlohrmeworkMiddleware from "../middleware";

/**
 * Factory for the abstract class.
 * 
 * @since 19/03/2023
 * @author Felipe Matheus Flohr
 */
type FlohrmeworkMiddlewareCreation = () => FlohrmeworkMiddleware;

export default FlohrmeworkMiddlewareCreation;
