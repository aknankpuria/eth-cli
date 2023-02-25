export interface Config {
    networks: {
        goerli: {
            name: string;
            rpc_url: string;
        };
        main: {
            name: string;
            rpc_url: string;
        };
    };
}

export interface ErrorOptions {
    suggestion?: string;
    displayWhole?: boolean;
}

export interface compiledOutput {
    contracts: {
        [srcName: string]: {
            [contractName: string]: {
                abi: [];
                evm: {
                    assembly: string;
                    bytecode: {
                        object: string;
                    };
                    gasEstimates: {
                        creation: {
                            codeDepositCost: string;
                            executionCost: string;
                            totalCost: string;
                        };
                    };
                };
            };
        };
    };
    errors: [];
}
