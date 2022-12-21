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
    this.liveLibrary = new Library()
    this.interactionListener()
    this.setInteractive = 0
  }

  /**
  * how to handle different inputs
  * @method hopRouter
  *
  */
  hopRouter = function (type, options) {
    if (type === 'launch') {
      this.startHOP.startSFECS(options)
      this.messageLive.setwSocket()
      this.messageLive.messageSendListeners()
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
  * @method startMessageAuth
  *
  */
  startMessageAuth = function () {
    this.messageLive.emit('hop-selfauth', options)
  }

  /**
  * 
  * @method interactionListener
  *
  */
  interactionListener = function () {
    this.messageLive.on('savetofile', () => {
      this.savetoFile('')
    })  
    this.messageLive.on('startover', () => {
      this.InteractiveHOP('')
    })  
    this.messageLive.once('interactive', (data) => {
      this.InteractiveHOP(data)
    })    
  }

  /**
  * get data from SafeFlow
  * @method savetoFile
  *
  */
  savetoFile = function (input) {
  let saveQuestion = [{ 
    question: `Save data to JSON file?`,
    options: [
      'yes',
      'no'
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
    .prompt(saveQuestion)
    .then((answers) => {
      // addition prompt yes or no?
      this.saveFileWorker(answers, 'safeflowdata')
    })
  }

  /**
  * 
  * @method saveFileWorker
  *
  */
  saveFileWorker = function (data, context) {
    console.log('save file or not then start over')
    console.log(data)
    console.log(context)
    if (data[0] === 'yes') {
      console.log('save file fuction')
      // let saveFile = this.FileUtility(data)
    } else {
      this.messageLive.emit('startover')
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
  * @method InteractiveHOP
  *
  */
  InteractiveHOP = function (type) {
    // need to have different interaction for setup, library, get or put etc.
    if (this.setInteractive === 1 || this.setInteractive === 2) {
      this.setInteractive += 1
      let baseContracttype = [{ 
        question: `Type of contract`,
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
        this.setInteractive = 0
        if (answers[0] === 'bentoboard') {
          this.safeflowModulecontract(answers)
        } else if (answers[0] === 'library') {
          this.typeContract(answers)
        }
      })
      .catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
        } else {
          // Something else went wrong
        }
      })
    } else {
      this.setInteractive++
    }
  }

  /**
  * get data from SafeFlow
  * @method safeflowModulecontract
  *
  */
   safeflowModulecontract = function (input) {
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
  * what type of contract style?
  * @method typeContract
  *
  */
   typeContract = function (input) {
    if (input[0] === 'exit') {
      console.log('exit the interactive prompt')
      process.exit(1)
    }
    let baseQuestion = [{ 
      question: `Style of contract`,
      options: [
        'reference',
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
        if (answers[0] === 'reference') {
          this.libraryRefcontracts(answers)
        } else if (answers[0] === 'module') {
          this.moduleContracts(answers)
        }
      })
   }

  /**
  * 
  * @method moduleContracts
  *
  */
  moduleContracts = function (input) {
    if (input[0] === 'exit') {
      console.log('exit the interactive prompt')
      process.exit(1)
    }
    let baseQuestion = [{ 
      question: `Select module type`,
      options: [
        'board',
        'experiment',
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
  * @method libraryRefcontracts
  *
  */
  libraryRefcontracts = function (input) {
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
  * take all the selections and route to get the data asked for
  * @method inputLogic
  *
  */
  inputLogic = function (input, selection, inputType) {
    let extractChoice = ''
    let refContract = ''
    // need logic to extract answers e.g. input list multi choice etc
    if (inputType === 'library') {
      extractChoice = input[0]
      refContract = selection.refcontract
      if (inputType === 'peerlibrary') {
      } else if (inputType === 'library') {
       // go and look up reference contract for with id from network library
       let peerInput = {}
       peerInput.type = extractChoice
       peerInput.refcont = refContract
       // need to send input to SafeFlow via a message
       let libraryInput = this.liveLibrary.formQuery(peerInput)
       // send via messenger
       this.messageLive.emit('library', libraryInput)
     } else if (extractChoice === 'exit') {
      console.log('exit the interactive prompt')
      process.exit(1)
     }
    } else if (inputType === 'safeflow') {
      extractChoice = input[0]
      // data requests
      if (extractChoice === 'experiment') {
        let refContract = selection.refcontract
        let peerInput = {}
        peerInput.type = extractChoice
        peerInput.refcont = refContract
        // need to send input to SafeFlow via a message
        let libraryInput = this.liveLibrary.formExperiment(peerInput)
        // pass via messenger
        // send message
        this.messageLive.emit('safeflow', libraryInput)
      } else if (extractChoice === 'exit') {
        console.log('exit the interactive prompt')
        process.exit(1)
      }
    }
  }

}

export default CliLogic
