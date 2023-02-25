import { ethers } from "ethers";

import Command from "./Command.js";
import { readContent } from "../utils.js";

export default class Interact extends Command {
    constructor(network: string) {
        super(network);
    }

    interact = async (
        _contract: string,
        abiPath: string,
        method: string,
        key: string | null
    ): Promise<void> => {
        this.startSpinner(`calling ${method} on contract`);

        try {
            const abi = await readContent(abiPath);

            const signer = key
                ? new ethers.Wallet(key, this.provider)
                : this.provider;

            const contract = new ethers.Contract(_contract, abi, signer);
            const resp = await eval(`contract.${method}`);

            this.stopSpinner();

            const data = {
                data: {
                    resp,
                },
            };

            this.logger("method call", data);
        } catch (error: any) {
            this.stopSpinner(false);

            console.error(error.name, error.message);
        }
    };
}
