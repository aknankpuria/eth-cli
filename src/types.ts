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
