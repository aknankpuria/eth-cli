import Command from "./Command.js";

export default class Block extends Command {
    constructor(network: string) {
        super(network);
    }

    showBlock = async (blockNumber: number): Promise<void> => {
        this.startSpinner("fetching block");

        try {
            const block = await this.provider.getBlock(blockNumber);

            this.stopSpinner();

            this.logger("block", block);
        } catch (error: any) {
            this.stopSpinner(false);

            console.error(error.name, error.message);
        }
    };
}
