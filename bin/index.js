#!/usr/bin/env node
import { program } from 'commander'

// start socket on different server port
// start with different Hyperspace
// key in nxp contract or module or refcontract  save create view etc.
// start server/websocket
// restart stop


program
    .command('launch')
    .description('start health oracle protocol')
   // .action()

program.parse()
