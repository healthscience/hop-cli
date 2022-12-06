'use strict'
/**
*  manage cli query flows and interfactive mode
*
*
* @class CliLogic
* @package    CliLogic
* @copyright  Copyright (c) 2022 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import util from 'util'
import EventEmitter from 'events'
import inquirer from 'inquirer'
import MessageHop from '../routes/message-hop.js'
import LaunchHOP from '../routes/launch-hop.js'
import Library from '../routes/library-helper.js'

class CliLogic extends EventEmitter {

  constructor() {
    super()
    this.startHOP = new LaunchHOP()
    this.messageLive = new MessageHop()
    this.messageListener()
    this.liveLibrary = new Library()

  }

  /**
  * how to handle different inputs
  * @method hopRouter
  *
  */
  hopRouter = function (type, options) {
    // let startHOP = new LaunchHOP()
    // let messageLive = new MessageHop()
    // this.messageListener(messageLive)
    // let liveLibrary = new Library()
    console.log('type')
    console.log(type)
    console.log(options)
    if (type === 'launch') {
      this.startHOP.startSFECS(options)
      this.messageLive.setwSocket()
      this.messageLive.messageSend()
      if (options.interactive === true) {
        this.InteractiveHOP(type)
      } else {
        // setup headless mode
      }
    } else if (type === 'message') {
      // first make sure HOP connection is live & launched
      // checkHOPconnection()
      this.messageLive.setwSocket(options)
      // messageLive.sendMessage(options)
      // messageLive.emit('hop-m', options)
    } else if (type === 'library') {
      // first make sure HOP connection is live & launched
      // let cliState = checkHOPconnection()
      console.log('please launch HOP first')
      this.liveLibrary.checkLibrary(options)
    }
  }

  /**
  * 
  * @method checkHOPconnection
  *
  */
  checkHOPconnection = function () {
    let connectionLive = false
    // check message for connection
    connectionLive  = this.messageLive.checkSocket()
    return connectionLive
  }


  /**
  * 
  * @method messageListener
  *
  */
   messageListener = function () {
    this.messageLive.on('hop', (data) => {
      console.log('HOP No network connected')
    })
    this.messageLive.on('message', (data) => {
      console.log('HOP Connected')
    })
    this.messageLive.on('startover', () => {
      console.log('ready for new input')
      this.InteractiveHOP('launch')
    })    
  }



  /**
  * 
  * @method InteractiveHOP
  *
  */
  InteractiveHOP = function (type) {
    console.log('interactive live')
    // need to have different interaction for setup, library, get or put etc.
    let baseContracttype = [{ 
      question: `Type of reference contract`,
      options: [
        'bentoboard',
        'library'
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
  
    questions = baseContracttype
  
    inquirer
    .prompt(questions)
    .then((answers) => {
      // addition prompt yes or no?
      console.log(answers)
      if (answers[0] === 'bentoboard') {
        this.safeflowModulecontract(answers)
      } else if (answers[0] === 'library') {
        this.libraryRefcontracts(answers)
      }
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    })
  }

  /**
  * 
  * @method safeflowModulecontract
  *
  */
   safeflowModulecontract = function (input) {
      console.log('bboard nxp contract module')
      console.log(input)
      if (input[0] === 'exit') {
        console.log('exit the interactive prompt')
        process.exit(1)
      }
      let baseQuestion = [{ 
        question: `View Bento Board Module Contract`,
        options: [
          'experiment',
          'back',
          'exit'
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
      
        inquirer
        .prompt(baseQuestion)
        .then((answers) => {
          // addition prompt yes or no?
          this.askRefContract(answers, 'safeflow')
        })      
   }

  /**
  * 
  * @method libraryRefcontracts
  *
  */
  libraryRefcontracts = function (input) {
    console.log('library contract options')
    console.log(input)
    if (input[0] === 'exit') {
      console.log('exit the interactive prompt')
      process.exit(1)
    }
    let baseQuestion = [{ 
      question: `View contract`,
      options: [
        'datatype',
        'compute',
        'data',
        'visualisation',
        'experiment',
        'module',
        'exit'
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
    
      inquirer
      .prompt(baseQuestion)
      .then((answers) => {
        // addition prompt yes or no?
        this.askRefContract(answers, 'library')
      })
   }

  /**
  * 
  * @method askRefContract
  *
  */
   askRefContract = function (input, type) {
    if (input[0] === 'exit') {
      console.log('exit the interactive prompt')
      process.exit(1)
    }
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
        this.inputLogic(input, answers, type)
      })
   }


  /**
  * f020a98b100ac40c109a1488220e9874cfa3f43a  -- compute
  * @method inputLogic
  *
  */
  inputLogic = function (input, selection, inputType) {
    console.log('selct and id')
    console.log(input)
    console.log(selection)
    console.log(inputType)
    let extractChoice = ''
    let refContract = ''
    // need logic to extract answers e.g. input list multi choice etc
    if (inputType === 'library') {
      extractChoice = input[0]
      refContract = selection.refcontract
    } else {
      extractChoice = input[0]
    }
    console.log('choice-----')
    console.log(extractChoice)
    if (extractChoice === 'exit') {
      console.log('exit the interactive prompt')
      process.exit(1)
    } else if (inputType === 'peerlibrary') {
      console.log('get library ref contract from peers personal library')
    } else if (inputType === 'library') {
      // go and look up reference contract for with id from network library
      let peerInput = {}
      peerInput.type = extractChoice
      peerInput.refcont = refContract
      // need to send input to SafeFlow via a message
      let libraryInput = this.liveLibrary.formQuery(peerInput)
      // pass via messenger
      console.log('post form q')
      console.log(libraryInput)
      this.messageLive.emit('library', libraryInput)
    }
   }

}

export default CliLogic
