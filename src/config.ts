import dotenv from "dotenv";
dotenv.config();

// import { Config } from "./types.js";

const config = {
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
