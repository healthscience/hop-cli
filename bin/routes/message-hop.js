'use strict'
/**
*  send and receive websocket messages
*
*
* @class MessageHop
* @package    MessageHOP
* @copyright  Copyright (c) 2022 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import util from 'util'
import EventEmitter from 'events'
import WebSocket from 'ws'
import { start } from 'repl'
import { builtinModules } from 'module'

class MessageHOP extends EventEmitter {

  constructor() {
    super()
    this.connected = false
    this.wsocket = {}
    this.hyperspaceFiles = {}
    this.hyperspaceStores = {}
    this.safeflowLibrary = []
    // this.messageListener()
  }

  /**
  * send message to protocol
  * @method setwSocket
  *
  */
  setwSocket = function () {
    let wsClient = new WebSocket('wss://127.0.0.1:9888', {
      noServer: true,
      rejectUnauthorized: false,
      perMessageDeflate: false
    })
    this.wsocket = wsClient
    wsClient.on('open', function open() {
      console.log('websocket client')
      this.connected = true
      this.emit('message', 'live')
    })


    wsClient.on('message', (data) => {
      this.displayFormatter(data)
    })

    wsClient.on('close', function closem() {

    })
    
    wsClient.on('error', function error() {
      console.log('socket client error')
      // process.exit(1)
      this.emit('hop', 'none')
     })
  }

  /**
  * socket connected?
  * @method checkSocket
  *
  */
  checkSocket = function () {
    return this.connected
  }

  /**
  * format for display on cli or maybe offer save as a file?
  * @method displayFormatter
  *
  */
  displayFormatter = function (data) {
    // console.log('display formatter')
    // console.log(data)
    if (typeof data !== 'string') {
      let buf = JSON.parse(data)
      // console.log(buf.type)
      // check if library nxp contract info returned?
      if (buf.type === 'peerlibrary' && buf.refcontract === 'experiment') {
        // do that check
        for (let liveC of this.safeflowLibrary) {
          if (buf.data.key === liveC) {
            // update message for SafeFlow Input
            const sfInput = {}
            sfInput.type = 'safeflow'
            sfInput.reftype = 'ignore'
            sfInput.action = 'networkexperiment'
            sfInput.data = {}
            sfInput.data.exp = buf.data
            sfInput.data.modules = buf.data.modules
            this.emit('safeflow', sfInput)
            // remove contract from list
            const index = this.safeflowLibrary.indexOf(liveC)
            this.safeflowLibrary.splice(index, 1)
          } else {
            console.log('normal display the data')
          }
        }
      } else if (buf.type === 'hyperbee-pubkeys') {
        this.hyperspaceStores = data
      } else if (buf.type === 'hyperdrive-pubkey') {
        this.hyperspaceFiles = data
      } else if (buf.type === 'auth-hop') {
        this.emit('interactive', {})
      } else {
        if (buf.type !== 'hyperbee-pubkeys') {
          // console.log('data back from SafeFlow-ECS')
          // console.log(buf)
          // console.table(buf)
          console.log(util.inspect(buf, {showHidden: false, depth: null, colors: true}))
          // give option to save data as JSON file?
          this.emit('savetofile')
        }
      }
    } else {
      if (data == 'live') {
        this.emit('hop-selfauth', {})
      }
    }

  }


  /**
  * 
  * @method messageListener
  *
  */
  messageListener = function () {
    this.on('hop', (data) => {
    })
    this.on('message', (data) => {
    })  
  }


  /**
  * send message to protocol
  * @method messageSendListeners
  *
  */
  messageSendListeners = function (ws) {
    this.on('hop-selfauth', (messgout) => {
      let startHOP = {}
      startHOP.type = 'safeflow'
      startHOP.reftype = 'ignore'
      startHOP.action = 'selfauth'
      startHOP.data = messgout
      let jsonStart = JSON.stringify(startHOP)
      this.wsocket.send(jsonStart)
    })

    this.on('hop-m', (messgout) => {
      let startHOP = {}
      startHOP.type = messgout.text
      startHOP.reftype = 'ignore'
      startHOP.action = messgout.action
      startHOP.data = {}
      let jsonStart = JSON.stringify(startHOP)
      this.wsocket.send(jsonStart)
    })

    this.on('library', (messgout) => {
      this.wsocket.send(JSON.stringify(messgout))
    })

    this.on('safeflow', (messgout) => {
      // if type library, putting together info for data requiest to safeflow
      // tell formatter so message can then be send to SafeFlow
      if (messgout.type === 'library') {
        this.safeflowLibrary.push(messgout.data.refcontract)
      }
      this.wsocket.send(JSON.stringify(messgout))
    })
   }

}

export default MessageHOP