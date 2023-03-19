import FlohrmeworkResponse from "./flohrmework_response";

export default class FlohrmeworkDataResponse extends FlohrmeworkResponse {
    public readonly data: FlohrmeworkEndpointReturnData;

    public constructor(data: FlohrmeworkEndpointReturnData) {
        super();
        this.data = data;
    }
}

export type FlohrmeworkEndpointReturnData = {
    readonly code: number
    readonly message?: string
    readonly content?: unknown
}