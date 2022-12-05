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
  
    if (type === 'launch') {
      this.startHOP.startSFECS(options)
      this.InteractiveHOP(type)
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
      // askRefContract()
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
    this.messageLive.setwSocket()
    this.messageLive.messageSend()
  
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
  
    inquirer
    .prompt(questions)
    .then((answers) => {
      // addition prompt yes or no?
      this.askRefContract()
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
  * f020a98b100ac40c109a1488220e9874cfa3f43a
  * @method inputLogic
  *
  */
  inputLogic = function (selection, inputType) {
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
      let libraryInput = this.liveLibrary.formQuery(peerInput)
      // pass via messenger
      this.messageLive.emit('library', libraryInput)
    }
   }

  /**
  * 
  * @method askRefContract
  *
  */
  askRefContract = function () {

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
        this.inputLogic(answers, 'refcontract')
      })
   }

}

export default CliLogic
