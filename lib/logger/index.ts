import {
    LoggerImplementation,
    MessagePrinter,
} from "@felipeflohr/flohr-common-logger";
import { FileWriter } from "@felipeflohr/flohr-common-logger";

/**
 * Logger used in the Flohrmework
 * 
 * @since 19/03/2023
 * @author Felipe Matheus Flohr
 */
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
