import path from "path";
import solc from "solc";
import fs from "fs";

import Command from "./Command.js";
import { readContent, writeContent } from "../utils.js";

import { compiledOutput } from "../types.js";

class DependencyPresentError extends Error {
    constructor() {
        super(
            "Dependencies in solidity source code detected. Currently only compilation of solidity files without dependencies(without import statements) is supported"
        );
        this.name = "DependencyPresentError";
    }
}

class CompilationError extends Error {
    data: Array<{}>;

    constructor(errorArray: Array<{}>) {
        super("Compilation Error");
        this.name = "compilationError";
        this.data = errorArray;
    }
}

export default class Compile extends Command {
    constructor(network: string) {
        super(network);
    }

    private createOrClearDirectory = async (dirName: string): Promise<void> => {
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName);
        } else {
            const files = await fs.promises.readdir(dirName);

            for (const file of files) {
                fs.unlink(path.join(dirName, file), (err) => {
                    if (err) throw err;
                });
            }
        }
    };

    private isDependencyPresent = (src: string): boolean => {
        if (src.match("import")) return true;

        return false;
    };

    compile = async (srcPath: string) => {
        this.startSpinner("compiling solidity");

        let gasEstimates = {};
        const outDirName = "compiled";

        try {
            await this.createOrClearDirectory(outDirName);
            const srcFileName = path.parse(srcPath).base;
            const srcFileContent = await readContent(srcPath);

            if (this.isDependencyPresent(srcFileContent)) {
                throw new DependencyPresentError();
            }

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

            const output: compiledOutput = JSON.parse(
                solc.compile(JSON.stringify(input))
            );

            if (output.errors) {
                throw new CompilationError(output.errors);
            }

            for (let srcName in output.contracts) {
                for (let contractName in output.contracts[srcName]) {
                    const data = output.contracts[srcName][contractName];
                    const bytecode = data.evm.bytecode.object;
                    const abi = data.abi;
                    gasEstimates = data.evm.gasEstimates;

                    writeContent(
                        path.join(outDirName, srcName + ".obj"),
                        bytecode
                    );
                    writeContent(
                        path.join(outDirName, srcName + ".abi"),
                        JSON.stringify(abi)
                    );
                }
            }

            this.stopSpinner();

            this.logger.log("gas estimations", gasEstimates);
        } catch (error: any) {
            this.stopSpinner(false);

            if (error instanceof DependencyPresentError) {
                this.logger.error(error, {
                    suggestion:
                        "Try compiling solidity source code with no import statements or dependencies",
                });
            } else if (error instanceof CompilationError) {
                this.logger.error(error, {
                    displayWhole: true,
                    suggestion:
                        "Try checking for syntax and other errors in passed solidity source code",
                });
            }
        }
    };
}
