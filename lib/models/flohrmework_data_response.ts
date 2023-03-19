import FlohrmeworkResponse from "./flohrmework_response";

/**
 * Data response of a controller endpoint.
 * 
 * @since 19/03/2023
 * @author Felipe Matheus Flohr
 */
export default class FlohrmeworkDataResponse extends FlohrmeworkResponse {
    public readonly data: FlohrmeworkEndpointReturnData;

    public constructor(data: FlohrmeworkEndpointReturnData) {
        super();
        this.data = data;
    }
}

/**
 * Return type of the
 * "FlohrmeworkDataResponse".
 * 
 * @since 19/03/2023
 * @author Felipe Matheus Flohr
 */
export type FlohrmeworkEndpointReturnData = {
    readonly code: number
    readonly message?: string
    readonly content?: unknown
}