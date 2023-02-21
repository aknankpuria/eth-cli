import { JsonRpcProvider, ethers } from "ethers";
import config from "./config.js";

export default class Action {
    private provider: JsonRpcProvider;

    constructor(network: string) {
        if (network == config.networks.goerli.name) {
            this.provider = new ethers.JsonRpcProvider(
                config.networks.goerli.rpc_url
            );
        } else {
            this.provider = new ethers.JsonRpcProvider(
                config.networks.mainnet.rpc_url
            );
        }
    }

    showBalance = async (address: string) => {
        try {
            const balance = (
                await this.provider.getBalance(address)
            ).toString();

            console.log(`wei: ${balance}\neth: ${ethers.formatEther(balance)}`);
        } catch (error: any) {
            console.error(error.name, error.message);
        }
    };

    showBlockNumber = async () => {
        try {
            const block = (await this.provider.getBlockNumber()).toString();

            console.log(`Block Number : ${block}`);
        } catch (error: any) {
            console.error(error.name, error.message);
        }
    };
}
