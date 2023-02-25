import Command from "./Command.js";

export default class Block extends Command {
    constructor(network: string) {
        super(network);
    }

    showTransaction = async (hash: string): Promise<void> => {
        this.startSpinner("fetching transaction");

        try {
            const tx = await this.provider.getTransaction(hash);

            this.stopSpinner();

            this.logger("transaction", tx);
        } catch (error: any) {
            this.stopSpinner(false);

            console.error(error.name, error.message);
        }
    };
}
