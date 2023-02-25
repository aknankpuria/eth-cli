import Command from "./Command.js";

export default class Blocknumber extends Command {
    constructor(network: string) {
        super(network);
    }

    showBlockNumber = async (): Promise<void> => {
        this.startSpinner("fetching block number");

        try {
            const block = (await this.provider.getBlockNumber()).toString();

            this.stopSpinner();

            this.logger("block number", block);
        } catch (error: any) {
            this.stopSpinner(false);

            console.error(error.name, error.message);
        }
    };
}
