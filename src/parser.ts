import commander from "commander";

import { balanceArgs } from "./types.js";
import showBalance from "./actions/showBalance.js";

export const cli = new commander.Command("eth");

const parse = () => {
    cli.option("--network <type>", "network to use", "goerli");

    cli.command("balance")
        .description("get balance of address")
        .requiredOption("--address <string>", "account or contract address")
        .action((args) => {
            showBalance({
                ...args,
                network: cli.opts().network,
            } as balanceArgs);
        });

    cli.parse();
};

export default parse;
