import { Command, Option } from "commander";

import config from "./config.js";

import Balance from "./Commands/Balance.js";
import Block from "./Commands/Block.js";
import Blocknumber from "./Commands/Blocknumber.js";
import Transaction from "./Commands/Transaction.js";
import Compile from "./Commands/Compile.js";
import Deploy from "./Commands/Deploy.js";
import Interact from "./Commands/Interact.js";
import SendEth from "./Commands/SendEth.js";

const cli = new Command("eth").version(config.version);

const parse = async () => {
    cli.addOption(
        new Option("--network <type>", "network to use")
            .default("goerli")
            .choices(["goerli", "mainnet"])
    );

    cli.command("balance")
        .description("get balance of address")
        .requiredOption("--address <string>", "account or contract address")
        .action((args) => {
            new Balance(cli.opts().network).showBalance(args.address);
        });

    cli.command("blocknumber")
        .description("get latest block number")
        .action(async () => {
            new Blocknumber(cli.opts().network).showBlockNumber();
        });

    cli.command("block")
        .description("get block data")
        .requiredOption("--number <block number>", "get data of block number")
        .action((args) => {
            new Block(cli.opts().network).showBlock(parseInt(args.number));
        });

    cli.command("transaction")
        .description("get transaction data")
        .requiredOption("--hash <transaction hash>", "transaction hash")
        .action((args) => {
            new Transaction(cli.opts().network).showTransaction(args.hash);
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
            new Compile(cli.opts().network).compile(args.src);
        });

    cli.command("deploy")
        .description("deploy a contract")
        .requiredOption(
            "--bytecode <contract bytecode path>",
            "path to contract bytecode"
        )
        .requiredOption("--abi <abi path>", "path to contract abi")
        .requiredOption("--key <private key>", "private key")
        .action((args) => {
            new Deploy(cli.opts().network).deploy(
                args.bytecode,
                args.abi,
                args.key
            );
        });

    cli.command("interact")
        .description("interact with already deployed contract")
        .requiredOption(
            "--contract <contract address>",
            "address of contract to interact with"
        )
        .requiredOption("--abi <abi paht>", "path to contract abi")
        .requiredOption("--method <method call>", 'eg. --method "getNumber()"')
        .option(
            "--key <private key>",
            "private key is needed to call state changing methods"
        )
        .action((args) => {
            new Interact(cli.opts().network).interact(
                args.contract,
                args.abi,
                args.method,
                args.key
            );
        });

    cli.command("sendEth")
        .description("send ether to address")
        .requiredOption(
            "--to <address>",
            "public address of account to send ether to"
        )
        .requiredOption("--value <value in ether>", "value to send in ether")
        .requiredOption("--key <private key>", "private key")
        .action((args) => {
            new SendEth(cli.opts().network).sendEth(
                args.to,
                args.value,
                args.key
            );
        });

    cli.parse();
};

export default parse;
