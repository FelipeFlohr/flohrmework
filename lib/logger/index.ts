import {
    LoggerImplementation,
    MessagePrinter,
} from "@felipeflohr/flohr-common-logger";
import { FileWriter } from "@felipeflohr/flohr-common-logger";

export default class Logger extends LoggerImplementation {
    public constructor() {
        const hasLogPath =
            process.env.FLOHRMEWORK_LOGGER_FOLDER_PATH !== undefined;

        super(
            new MessagePrinter(),
            hasLogPath
                ? new FileWriter({
                      folderToSaveLogFile: process.env
                          .FLOHRMEWORK_LOGGER_FOLDER_PATH as string,
                  })
                : undefined
        );
    }
}
