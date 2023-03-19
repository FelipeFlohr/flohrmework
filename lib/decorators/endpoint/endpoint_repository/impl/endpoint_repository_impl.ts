import HttpMethod from "../../../../enums/http_methods";
import EndpointModel from "../../../../models/endpoint_model";
import FlohrmeworkControllerEndpoint from "../../../../types/flohrmework_controller_endpoint";
import IEndpointRepository from "../endpoint_repository";
import { Injectable } from "@felipeflohr/flohr-common-injection";

@Injectable()
export default class EndpointRepositoryImpl implements IEndpointRepository {
    private readonly endpoints: EndpointModel[]

    public constructor() {
        this.endpoints = [];
    }

    public addEndpoint(path: string, method: HttpMethod, func: FlohrmeworkControllerEndpoint): void {
        this.endpoints.push(new EndpointModel(path, method, func))
    }

    public getEndpoints(): EndpointModel[] {
        return this.endpoints;
    }
}