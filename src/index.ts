#! /usr/bin/env node

import figlet from "figlet";
import chalk from "chalk";

import parse from "./parser.js";

const displayBanner = () => {
    const title = " e t h  c l i";
    const desc =
        "   A minimalistic CLI for interacting with ethereum mainnet and testnetworks";

    const bannerTitle = chalk.blue(
        figlet.textSync(title, {
            font: "Bloody",
        })
    );

    const bannerDesc = chalk.blue(desc);

    const banner = "\n" + bannerTitle + "\n" + bannerDesc + "\n";

    console.log(banner);
};

const main = () => {
    displayBanner();
    parse();
};

main();
