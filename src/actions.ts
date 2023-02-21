import { JsonRpcProvider, ethers } from "ethers";
import ora, { Ora } from "ora";
import logSymbols from "log-symbols";

import config from "./config.js";

export default class Action {
    private provider: JsonRpcProvider;
    private spinner: Ora;

    constructor(network: string) {
        if (network == config.networks.goerli.name) {
            this.provider = new ethers.JsonRpcProvider(
                config.networks.goerli.rpc_url
            );
        } else {
            this.provider = new ethers.JsonRpcProvider(
                config.networks.mainnet.rpc_url
            );
        }

        this.spinner = ora({ spinner: "dots5" });
    }

    private startSpinner = (name: string): void => {
        this.spinner.text = name;
        this.spinner.start();
    };

    private stopSpinner = (symbol: string): void => {
        this.spinner.stopAndPersist({
            symbol,
        });
    };

    showBalance = async (address: string): Promise<void> => {
        this.startSpinner("fetching balance");

        try {
            const balance = (
                await this.provider.getBalance(address)
            ).toString();

            this.stopSpinner(logSymbols.success);

            console.log(`wei: ${balance}\neth: ${ethers.formatEther(balance)}`);
        } catch (error: any) {
            this.stopSpinner(logSymbols.error);

            console.error(error.name, error.message);
        }
    };

    showBlockNumber = async (): Promise<void> => {
        this.startSpinner("fetching block number");

        try {
            const block = (await this.provider.getBlockNumber()).toString();

            this.stopSpinner(logSymbols.success);

            console.log(`Block Number : ${block}`);
        } catch (error: any) {
            this.stopSpinner(logSymbols.error);

            console.error(error.name, error.message);
        }
    };
}
