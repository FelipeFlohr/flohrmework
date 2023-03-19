import { Container } from "@felipeflohr/flohr-common-injection";
import Logger from "../logger";
import TYPES from "./types";
const container = new Container();

container.bind<Logger>(TYPES.Logger).toConstant(new Logger());

export default container;