/**
 * Parent class of a controller.
 * Defines the controller path.
 * 
 * @since 19/03/2023
 * @author Felipe Matheus Flohr
 */
export default abstract class FlohrmeworkController {
    /**
     * Path of the controller.
     * 
     * @since 19/03/2023
     * @author Felipe Matheus Flohr
     */
    public abstract readonly path: string
}