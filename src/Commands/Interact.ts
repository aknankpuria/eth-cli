import { ethers, isError } from "ethers";

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

            this.logger.log("method call", data);
        } catch (error: any) {
            this.stopSpinner(false);

            if (isError(error, "INVALID_ARGUMENT")) {
                this.logger.error(error, {
                    suggestion:
                        "Try checking name of the passed method and it's parameters OR value of private key",
                });
            } else if (isError(error, "UNSUPPORTED_OPERATION")) {
                this.logger.error(error, {
                    suggestion:
                        "Try checking datatypes and number of parameters passed to method",
                });
            } else if (error.code == "ENOENT") {
                this.logger.error(error, {
                    suggestion: "Try checking path of passed abi or bytecode",
                });
            }

            this.logger.error(error);
        }
    };
}
