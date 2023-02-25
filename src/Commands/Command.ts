import { JsonRpcProvider, ethers } from "ethers";
import ora, { Ora } from "ora";
import logSymbols from "log-symbols";
import prettyjson from "prettyjson";
import chalk from "chalk";

import config from "../config.js";
import { ErrorOptions } from "../types.js";

class Logger {
    private stringifyData = (data: any): string => {
        return JSON.stringify(data, (key, value) => {
            return typeof value === "bigint" ? value.toString() : value;
        });
    };

    log = (_title: string, _data: any) => {
        const title = chalk.bold.yellow(_title + ":-");

        const data = this.stringifyData(_data);

        console.log(`${title}\n${prettyjson.renderString(data)}`);
    };

    error = (error: any, _options?: ErrorOptions) => {
        const defaultOptions: ErrorOptions = {
            displayWhole: false,
            suggestion: "No Suggestion",
        };

        const options: ErrorOptions = {
            ...defaultOptions,
            ..._options,
        };

        if (!options.displayWhole) {
            const data = {
                name: error.name,
                message: error.message,
                suggestion: options.suggestion,
            };

            console.log(
                `${chalk.bold.red("Error" + ":-")}\n${prettyjson.render(data)}`
            );
        } else {
            const data = this.stringifyData({
                error,
                suggestion: options.suggestion,
            });

            console.log(
                `${chalk.bold.red("Error" + ":-")}\n${prettyjson.renderString(
                    data
                )}`
            );
        }
    };
}

export default abstract class Command {
    protected provider: JsonRpcProvider;
    protected spinner: Ora;
    protected logger: Logger = new Logger();

    constructor(network: string) {
        this.provider = new ethers.JsonRpcProvider(
            network == config.networks.goerli.name
                ? config.networks.goerli.rpc_url
                : config.networks.mainnet.rpc_url
        );

        this.spinner = ora({ spinner: "dots5" });
    }

    protected startSpinner = (name: string): void => {
        this.spinner.text = name;
        this.spinner.start();
    };

    /**
     *
     * @param success success indicator. defaults to  true
     */
    protected stopSpinner = (success = true): void => {
        this.spinner.stopAndPersist({
            symbol: success ? logSymbols.success : logSymbols.error,
        });
        console.log();
    };
}
