import { Config } from "./types.js";

const config: Config = {
    networks: {
        goerli: {
            name: "goerli",
            rpc_url: process.env.GOERLI_RPC_URL!,
        },
    },
};

export default config;
