import Command from "./Command.js";
import { isError } from "ethers";

export default class Block extends Command {
    constructor(network: string) {
        super(network);
    }

    showBlock = async (blockNumber: number): Promise<void> => {
        this.startSpinner("fetching block");

        try {
            const block = await this.provider.getBlock(blockNumber);

            this.stopSpinner();

            this.logger.log("block", block);
        } catch (error: any) {
            this.stopSpinner(false);

            if (isError(error, "INVALID_ARGUMENT")) {
                if (error.message.includes("overflow")) {
                    this.logger.error(error, {
                        suggestion:
                            "provided block number is greater than blocks on blockchain. Try providing a lower block number",
                    });
                } else {
                    this.logger.error(error, {
                        suggestion:
                            "provided block number does not have number data type. Make sure it is of type number",
                    });
                }
            } else {
                this.logger.error(error);
            }
        }
    };
}
