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

            this.logger.log("transaction", tx);
        } catch (error: any) {
            this.stopSpinner(false);

            this.logger.error(error, {
                suggestion: "Try checking value of passed transaction hash",
            });
        }
    };
}
