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

    cli.command("compile")
        .description(
            "compile solidity smart contract. outputs abi and object code in compiled directory. currently compilation of solidity files without libraries(importing other solidity files) is supported"
        )
        .requiredOption(
            "--src <path>",
            "path to solidity smart contract source code"
        )
        .action((args) => {
            const network = cli.opts().network;
            new Action(network).compile(args.src);
        });

    cli.parse();
};

export default parse;
