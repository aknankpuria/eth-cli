import dotenv from "dotenv";
dotenv.config();

const config = {
    version: "0.1.5",
    networks: {
        goerli: {
            name: "goerli",
            rpc_url: process.env.GOERLI_RPC_URL!,
        },
        mainnet: {
            name: "mainnet",
            rpc_url: process.env.MAINNET_RPC_URL!,
        },
    },
};

export default config;
