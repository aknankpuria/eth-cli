import Command from "./Command.js";
import { ethers, TransactionLike } from "ethers";

export default class SendEth extends Command {
    constructor(network: string) {
        super(network);
    }

    sendEth = async (to: string, value: string, key: string): Promise<void> => {
        this.startSpinner("sending ether");

        try {
            const wallet = new ethers.Wallet(key, this.provider);

            const tx: TransactionLike = {
                value: ethers.parseEther(value),
                to,
                from: await wallet.getAddress(),
            };

            const txResponse = await wallet.sendTransaction(tx);

            this.stopSpinner();
            this.startSpinner("waiting for confirmation");

            const txReciept = await txResponse.wait(1);

            const data = {
                ...txResponse,
                ...txReciept,
            };

            this.stopSpinner();

            this.logger.log("transaction", data);
        } catch (error: any) {
            this.stopSpinner(false);

            if (ethers.isError(error, "UNCONFIGURED_NAME")) {
                this.logger.error(error, {
                    suggestion:
                        "provided address does not seem correct. Try checking it",
                });
            } else if (ethers.isError(error, "INVALID_ARGUMENT")) {
                this.logger.error(error, {
                    suggestion: "Try checking value of passed private key",
                });
            } else {
                this.logger.error(error);
            }
        }
    };
}
