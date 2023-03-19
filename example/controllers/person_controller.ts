import { Request } from "express";
import { FlohrmeworkController, FlohrmeworkDataResponse, FlohrmeworkResponse, Get } from "../../lib";

export default class PersonController extends FlohrmeworkController {
    public readonly path: string = "/person";

    @Get("/:id")
    public async getPerson(req: Request): Promise<FlohrmeworkResponse> {
        return new FlohrmeworkDataResponse({
            code: 200,
            message: "SUCCESS",
            content: {
                id: req.params.id,
                name: "John Doe"
            }
        });
    }
}