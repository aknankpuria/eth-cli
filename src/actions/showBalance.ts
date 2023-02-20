import { balanceArgs } from "../types.js";
import config from "../config.js";

const getProvider = async (network: string) => {
    const ethers = await import("ethers");

    if (network == config.networks.goerli.name)
        return new ethers.JsonRpcProvider(config.networks.goerli.rpc_url);
};

const showBalance = async (args: balanceArgs) => {
    const provider = await getProvider(args.network);
    try {
        console.log(await provider?.getBalance(args.address));
    } catch (error: any) {
        console.error(error.name, error.message);
    }
};

export default showBalance;
