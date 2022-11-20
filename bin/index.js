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
    .option('-a, --action [hopaction]', 'action object for HOP')
    .action((str, options) => {
        hopRouter('message', options)
    })
program.parse()

function hopRouter (type, options) {
  console.log(type)
  let messageLive = new MessageHop()
  let startHOP = new LaunchHOP()
  let liveLibrary = new Library()
  function waitSetup () {
    console.log('setting up websocket client')
    if (type === 'launch') {
      startHOP.startSFECS(options)
    } else if (type === 'message') {
      // first make sure HOP connection is live & launched
      // messageLive.sendMessage(options)
      messageLive.emit('hop-m', options)
    } else if (type === 'library') {
      // first make sure HOP connection is live & launched
      liveLibrary.start(options)
    }
  }
  setTimeout(waitSetup, 1000)

}