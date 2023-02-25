import { JsonRpcProvider, ethers } from "ethers";
import config from "../config.js";
import ora, { Ora } from "ora";
import logSymbols from "log-symbols";
import prettyjson from "prettyjson";
import chalk from "chalk";

export default abstract class Command {
    protected provider: JsonRpcProvider;
    protected spinner: Ora;

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

    protected logger = (_title: string, _data: any) => {
        const title = chalk.bold.yellow(_title + ":-");

        if (typeof _data == "string") {
            console.log(title, prettyjson.renderString(_data));
        } else {
            const data = JSON.stringify(_data, (key, value) => {
                return typeof value === "bigint" ? value.toString() : value;
            });

            console.log(`${title}\n${prettyjson.renderString(data)}`);
        }
    };
}
