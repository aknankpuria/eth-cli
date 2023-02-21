import { Command, Option } from "commander";

import Action from "./actions.js";

const cli = new Command("eth");

const parse = () => {
    cli.addOption(
        new Option("--network <type>", "network to use")
            .default("goerli")
            .choices(["goerli", "mainnet"])
    );

    cli.command("balance")
        .description("get balance of address")
        .requiredOption("--address <string>", "account or contract address")
        .action((args) => {
            const network = cli.opts().network;
            new Action(network).showBalance(args.address);
        });

    cli.command("block")
        .description("get latest block number")
        .action(() => {
            const network = cli.opts().network;
            new Action(network).showBlockNumber();
        });

    cli.parse();
};

export default parse;
