export interface balanceArgs {
    address: string;
    network: string;
}

export interface Config {
    networks: {
        goerli: {
            name: string;
            rpc_url: string;
        };
    };
}
