#! /usr/bin/env node

import parseArgs from "./argParser.js";
import figlet from "figlet";
import chalk from "chalk";

const main = () => {
    console.log(chalk.blue(figlet.textSync("eth")));
    const a = parseArgs();
};

main();
