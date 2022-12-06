#!/usr/bin/env node
import { Command } from 'commander'
const program = new Command()
import HopPackage  from './../package.json' assert { type: 'json' }
import CliLogic from './logic/interaction.js'
// start socket on different server port
// start with different Hyperspace
// key in nxp contract or module or refcontract  save create view etc.
// start server/websocket
// restart stop
let cliLive = new CliLogic()

program
    .description('cli health oracle protocol')
    .version(HopPackage.version, '-v, --version')

program    
    .command('launch [launch]')
    .description('start HOP')
    .option('-a, --address [addr]', 'web socket url')
    .option('-p, --port [port]', 'web socket port', '9888')
    .option('-i, --interactive', 'live commands', true)
    // .parse(process.argv)
    .action((str, options) => {
      cliLive.hopRouter('launch', options)
    })

program
    .command('library [library]')
    .description('query the network library')
    // network library
    .option('-rc, --refcont [refcontract]', 'hash of contract')
    .action((str, options) => {
      cliLive.hopRouter('library', options)
    })

program
    .command('hopmessage [hopmessage]')
    .description('hop message')
    // network library
    .option('-t, --text [hopmessage]', 'message object for HOP')
    .option('-a, --action [hopaction]', 'action object for HOP')
    .action((str, options) => {
      cliLive.hopRouter('message', options)
    })

program.parse()

/*

{
    "key": "215b967596da807c95d4fd47c0795d03f45e0eca",
    "value": {
        "refcontract": "experiment",
        "modules": [
            "c6ef96e2a5b896b4f1cb39da970a9681b5d7e753",
            "59166668f919ccbf648a96d90953b42bea673d6b",
            "504f468f49778ad8c5f114812acf42288debca2a",
            "10806e3fa0883949206737b583d18cd4a20ab554"
        ],
        "concept": {
            "state": "joined"
        },
        "space": {
            "concept": "mind"
        },
        "computational": {
            "refcontract": null
        }
    }
}

*/