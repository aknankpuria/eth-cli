import { CommandModule } from "yargs";

const address: CommandModule = {
    command: "address balance <address>",
    builder: (yargs) => {
        return yargs.positional("address", {
            type: "string",
            desc: "get balance for this address",
        });
    },
    handler: ({ address }) => {
        console.log("fetching balance: ", address);
    },
};

export default address;
