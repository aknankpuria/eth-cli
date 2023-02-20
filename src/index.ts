#! /usr/bin/env node

import figlet from "figlet";
import chalk from "chalk";
import dotenv from "dotenv";
dotenv.config();

import parse from "./parser.js";

const main = () => {
    console.log(chalk.blue(figlet.textSync("eth")));
    parse();
};

main();
