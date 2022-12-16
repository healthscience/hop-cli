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