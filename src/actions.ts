import { JsonRpcProvider, ethers } from "ethers";
import ora, { Ora } from "ora";
import logSymbols from "log-symbols";
import path from "path";
import fs from "fs";
import solc from "solc";

import config from "./config.js";
import { compiledOutput } from "./types.js";

export default class Action {
    private provider: JsonRpcProvider;
    private spinner: Ora;

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

        this.spinner = ora({ spinner: "dots5" });
    }

    private startSpinner = (name: string): void => {
        this.spinner.text = name;
        this.spinner.start();
    };

    private stopSpinner = (symbol: string): void => {
        this.spinner.stopAndPersist({
            symbol,
        });
    };

    showBalance = async (address: string): Promise<void> => {
        this.startSpinner("fetching balance");

        try {
            const balance = (
                await this.provider.getBalance(address)
            ).toString();

            this.stopSpinner(logSymbols.success);

            console.log(`wei: ${balance}\neth: ${ethers.formatEther(balance)}`);
        } catch (error: any) {
            this.stopSpinner(logSymbols.error);

            console.error(error.name, error.message);
        }
    };

    showBlockNumber = async (): Promise<void> => {
        this.startSpinner("fetching block number");

        try {
            const block = (await this.provider.getBlockNumber()).toString();

            this.stopSpinner(logSymbols.success);

            console.log(`Block Number : ${block}`);
        } catch (error: any) {
            this.stopSpinner(logSymbols.error);

            console.error(error.name, error.message);
        }
    };

    compile = async (srcPath: string) => {
        this.startSpinner("compiling solidity");

        const readContent = (file: string) => {
            try {
                return fs.readFileSync(file, "utf-8");
            } catch (error: any) {
                this.stopSpinner(logSymbols.error);
                console.error(error.name, error.message);
                process.exit(1);
            }
        };

        const writeContent = (content: string, file: string) => {
            try {
                if (!fs.existsSync("compiled")) {
                    fs.mkdirSync("compiled");
                }

                const filePath = path.join("compiled", file);

                fs.writeFileSync(filePath, content, "utf-8");
            } catch (error: any) {
                this.stopSpinner(logSymbols.error);
                console.error(error.name, error.message);
                process.exit(1);
            }
        };

        const createOrClearDirectory = () => {
            const dirName = "compiled";

            try {
                if (!fs.existsSync(dirName)) {
                    fs.mkdirSync(dirName);
                }

                const files = fs.readdirSync("compiled");

                for (const file of files) {
                    fs.unlink(path.join("compiled", file), (err) => {
                        if (err) throw err;
                    });
                }
            } catch (error: any) {
                this.stopSpinner(logSymbols.error);
                console.error(error.name, error.message);
                process.exit(1);
            }
        };
        createOrClearDirectory();

        const isDependencyPresent = (src: string) => {
            if (src.match("import")) return true;

            return false;
        };

        const srcFileName = path.parse(srcPath).base;
        const srcFileContent = readContent(srcPath);

        const input = {
            language: "Solidity",
            sources: {
                [srcFileName]: {
                    content: srcFileContent,
                },
            },
            settings: {
                outputSelection: {
                    "*": {
                        "*": ["*"],
                    },
                },
            },
        };

        try {
            if (isDependencyPresent(srcFileContent)) {
                throw new Error(
                    "currently only compilation of solidity files without dependencies(without import statements) is supported"
                );
            }
            const output: compiledOutput = JSON.parse(
                solc.compile(JSON.stringify(input))
            );

            for (let srcName in output.contracts) {
                for (let contractName in output.contracts[srcName]) {
                    const data = output.contracts[srcName][contractName];
                    const obj = data.evm.bytecode.object;
                    const abi = data.abi;
                    const gasEstimation = data.evm.gasEstimates;

                    writeContent(obj, srcName + ".obj");
                    writeContent(JSON.stringify(abi), srcName + ".abi");

                    this.stopSpinner(logSymbols.success);

                    console.log("gas estimations");
                    console.log(
                        `code deposit cost: ${gasEstimation.creation.codeDepositCost}`
                    );
                    console.log(
                        `execution cost: ${gasEstimation.creation.executionCost}`
                    );
                    console.log(
                        `total cost: ${gasEstimation.creation.totalCost}`
                    );
                }
            }
        } catch (error: any) {
            this.stopSpinner(logSymbols.error);
            console.error(error.name, error.message);
            process.exit(1);
        }
    };
}
