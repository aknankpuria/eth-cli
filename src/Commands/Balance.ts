import Command from "./Command.js";
import { ethers } from "ethers";

export default class Balance extends Command {
    constructor(network: string) {
        super(network);
    }

    showBalance = async (address: string): Promise<void> => {
        this.startSpinner("fetching balance");

        try {
            const balance = (
                await this.provider.getBalance(address)
            ).toString();

            this.stopSpinner();

            const data = {
                wei: balance,
                eth: ethers.formatEther(balance),
            };

            this.logger("balance", data);
        } catch (error: any) {
            this.stopSpinner(false);

            console.error(error.name, error.message);
        }
    };
}
