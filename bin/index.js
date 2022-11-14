#!/usr/bin/env node
import { Command } from 'commander'
const program = new Command()
import HopPackage  from './../package.json' assert { type: 'json' }
import inquirer from 'inquirer'
import MessageHop from './routes/message-hop.js'
import LaunchHOP from './routes/launch-hop.js'
import Library from './routes/library-hop.js'

// start socket on different server port
// start with different Hyperspace
// key in nxp contract or module or refcontract  save create view etc.
// start server/websocket
// restart stop


program
    .description('cli health oracle protocol')
    .version(HopPackage.version, '-v, --version')

program    
    .command('launch [launch]')
    .description('start HOP')
    .option('-a, --address [addr]', 'web socket url')
    .option('-p, --port [port]', 'web socket port')
    // .parse(process.argv)
    .action((str, options) => {
      hopRouter('launch', options)
    })

program
    .command('library [library]')
    .description('query the network library')
    // network library
    .option('-rc, --refcont [refcontract]', 'hash of contract')
    .action((str, options) => {
        hopRouter('library', options)
    })

program
    .command('hopmessage [hopmessage]')
    .description('hop message')
    // network library
    .option('-t, --text [hopmessage]', 'message object for HOP')
    .action((str, options) => {
        hopRouter('message', options)
    })
program.parse()

let messageLive = new MessageHop()
let liveHOP = new LaunchHop()
let liveLibrary = new Library()

function hopRouter (type, options) {
    console.log('what to do?')
    console.log(type)
    console.log(options)
    if (type === 'launch') {
      liveHOP.start(options)
    } else if (type === 'hopmessage') {
      messageLive.sendMessage(options)
    } else if (type === 'library') {
      liveLibrary.start(options)
    }
}