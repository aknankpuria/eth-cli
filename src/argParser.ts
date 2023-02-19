import yargs from "yargs";
import addressCommand from "./commands/address.js";

interface Options {
    [x: string]: yargs.Options;
}

const networkOptions: Options = {
    goerli: {
        type: "boolean",
        default: true,
    },
    mainnet: {
        type: "boolean",
        default: false,
    },
};

const parseArgs = () => {
    const argv = yargs(process.argv.slice(2))
        .usage("$0 address:balance <address>")
        .options({
            ...networkOptions,
        })
        .command(addressCommand)
        .parseSync();

    return argv;
};

export default parseArgs;
