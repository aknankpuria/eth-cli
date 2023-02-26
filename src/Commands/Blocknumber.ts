import Command from "./Command.js";
import { isError } from "ethers";

export default class Blocknumber extends Command {
    constructor(network: string) {
        super(network);
    }

    showBlockNumber = async (): Promise<void> => {
        this.startSpinner("fetching block number");

        try {
            const block = (await this.provider.getBlockNumber()).toString();

            const data = {
                latestBlock: block,
            };

            this.stopSpinner();

            this.logger.log("block number", data);
        } catch (error: any) {
            this.stopSpinner(false);

            this.logger.error(error);
        }
    };
}
