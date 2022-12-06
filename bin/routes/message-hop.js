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

class MessageHOP extends EventEmitter {

  constructor() {
    super()
    this.connected = false
    this.wsocket = {}
  }

  /**
  * send message to protocol
  * @method setwSocket
  *
  */
  setwSocket = function () {
    console.log('set socket client')
    let wsClient = new WebSocket('wss://127.0.0.1:9888', {
      noServer: true,
      rejectUnauthorized: false,
      perMessageDeflate: false
    })
    this.wsocket = wsClient
    wsClient.on('open', function open() {
      console.log('ws open client')
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

     // this.messageListener(wsClient)
  }

  /**
  * socket connected?
  * @method checkSocket
  *
  */
  checkSocket = function () {
    console.log('check socket')
    return this.connected
  }

  /**
  * format for display on cli or maybe offer save as a file?
  * @method displayFormatter
  *
  */
  displayFormatter = function (data) {
    console.log('display formatter')
    // console.log(data)
    if (typeof data !== 'string') {
      let buf = JSON.parse(data)
      // let bufJSON = JSON.parse(buf.toString())
      // let convert = bufJSON.data.toJSON()
      // let stringO = data.toString()
      // console.log(JSON.parse(stringO))
      // let dataString = data.toString()
      console.log(buf)
      if (buf.type !== 'hyperbee-pubkeys') {
        // console.table(buf)
        console.log(util.inspect(buf, {showHidden: false, depth: null, colors: true}))
        this.emit('startover')
      }
    }

  }

  /**
  * send message to protocol
  * @method messageSend
  *
  */
  messageSend = function (ws) {
    this.on('hop-m', (messout) => {
      let startHOP = {}
      startHOP.reftype = 'ignore'
      startHOP.type = messout.text
      startHOP.action = messout.action
      startHOP.data = {}
      let jsonStart = JSON.stringify(startHOP)
      this.wsocket.send(jsonStart)
    })

    this.on('library', (messout) => {
      // console.log('library out message')
      // console.log(messout)
      this.wsocket.send(JSON.stringify(messout))
    })
   }

}

export default MessageHOP