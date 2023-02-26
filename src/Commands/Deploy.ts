import { ethers, isError } from "ethers";

import Command from "./Command.js";
import { readContent } from "../utils.js";

export default class Deploy extends Command {
    constructor(network: string) {
        super(network);
    }

    deploy = async (
        bytecodePath: string,
        abiPath: string,
        privateKey: string
    ): Promise<void> => {
        this.startSpinner("deploying contract");

        try {
            const bytecode = await readContent(bytecodePath);
            const abi = await readContent(abiPath);

            const wallet = new ethers.Wallet(privateKey, this.provider);
            const contractFactory = new ethers.ContractFactory(
                abi,
                bytecode,
                wallet
            );

            const contract = await contractFactory.deploy();

            this.stopSpinner();
            this.startSpinner("waiting for block confirmation");

            const transactionReceipt = await contract
                .deploymentTransaction()
                ?.wait(1);
            contract.deploymentTransaction();
            const transactionResponse = contract.deploymentTransaction();

            const contractData = {
                ...transactionReceipt,
                ...transactionResponse,
            };

            this.stopSpinner();

            this.logger.log("contract", contractData);
        } catch (error: any) {
            this.stopSpinner(false);

            if (isError(error, "INVALID_ARGUMENT")) {
                this.logger.error(error, {
                    suggestion: "Try checking value of private key",
                });
            } else if (error.code == "ENOENT") {
                this.logger.error(error, {
                    suggestion: "Try checking path of passed abi or bytecode",
                });
            } else {
                this.logger.error(error);
            }
        }
    };
}
