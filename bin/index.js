#!/usr/bin/env node
import { Command } from 'commander'
const program = new Command()
import HopPackage  from './../package.json' assert { type: 'json' }
import CliLogic from './logic/interaction.js'
import cliLogic from './logic/interaction.js'
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
function hopRouter (type, options) {
  let startHOP = new LaunchHOP()
  let messageLive = new MessageHop()
  messageListener(messageLive)
  let liveLibrary = new Library()

  if (type === 'launch') {
    startHOP.startSFECS(options)
    InteractiveHOP(type, messageLive, liveLibrary)
  } else if (type === 'message') {
    // first make sure HOP connection is live & launched
    // checkHOPconnection()
    messageLive.setwSocket(options)
    // messageLive.sendMessage(options)
    // messageLive.emit('hop-m', options)
  } else if (type === 'library') {
    // first make sure HOP connection is live & launched
    // let cliState = checkHOPconnection()
    console.log('please launch HOP first')
    liveLibrary.checkLibrary(options)
  }

  function checkHOPconnection () {
    let connectionLive = false
    // check message for connection
    connectionLive  = messageLive.checkSocket()
    return connectionLive
  }

} 

function messageListener (messageLive) {

  messageLive.on('hop', (data) => {
    console.log('HOP No network connected')
  })
  messageLive.on('message', (data) => {
    console.log('HOP Connected')
  })
  messageLive.on('startover', () => {
    console.log('ready for new input')
    // askRefContract()
  })
}


function InteractiveHOP (type, liveMessage, liveLibrary) {
  console.log('interactive live')
  // need to have different interaction for setup, library, get or put etc.
  liveMessage.setwSocket()
  liveMessage.messageSend()

  let baseQuestion = [{ 
    question: `View contract`,
    options: [
      'datatype',
      'compute',
      'data',
      'visualisation',
      'experiment',
      'module'
    ]
  }].map(({
    question,
    options
  }, i) => ({  
    type: 'list',
    message: question,
    choices: options,
    name: `${i}`,
  }))

  let testQuestions = [{ 
    question: `List peer bentoBoards`,
     options: [ 
      '1',  
      '2',  
      '10' 
    ]
  }].map(({
    question,
    options
  }, i) => ({  
    type: 'list',
     message: question,
     choices: options,
     name: `${i}`,
  }))

  let questions = []

  if (type === 'launch') {
    questions = baseQuestion
  } else if (type === 'library') {
    questions = testQuestions
  }

  function askRefContract () {
    let refQuestion = [
      {
        type: 'input',
        name: 'refcontract',
        message: 'Please enter contract ID',
        validate(value) {
          let stringCheck = typeof value
          let valid = false
          if (stringCheck === 'string') {
            valid = true
          }
          return valid || 'Please enter a reference'
        }
      }
    ]
    
      inquirer
      .prompt(refQuestion)
      .then((answers) => {
        // addition prompt yes or no?
        inputLogic(answers, 'refcontract', liveMessage, liveLibrary)
      })
  }

  inquirer
  .prompt(questions)
  .then((answers) => {
    // addition prompt yes or no?
    askRefContract()
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  })


  function inputLogic (selection, inputType, liveMessage, liveLibrary) {
    let extractChoice = ''
    let refContract = ''
    // need logic to extract answers e.g. input list multi choice etc
    if (inputType === 'refcontract') {
      extractChoice = 'refcontract'
      refContract = selection.refcontract
    } else {
      extractChoice = selection[0]
    }

    if (extractChoice === 'exit') {
      console.log('exit the interactive prompt')
      process.exit(1)
    } else if (extractChoice === 'datatype') {
      console.log('get library ref contract for data type, need contract id')
    } else if (extractChoice === 'refcontract') {
      // go and look up reference contract for with id
      let peerInput = {}
      peerInput.type = 'datatype'
      peerInput.refcont = refContract
      // need to send input to SafeFlow via a message
      let libraryInput = liveLibrary.formQuery(peerInput)
      // pass via messenger
      liveMessage.emit('library', libraryInput)
    }
  }

}
*/