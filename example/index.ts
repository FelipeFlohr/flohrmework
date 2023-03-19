import { Server } from "../lib";
import PersonController from "./controllers/person_controller";
import BodyParserMiddleware from "./middlewares/body_parser";

const server = new Server({
    controllers: [
        () => new PersonController()
    ],
    middlewares: [
        () => new BodyParserMiddleware()
    ],
    port: 8080,
});

server.listen();