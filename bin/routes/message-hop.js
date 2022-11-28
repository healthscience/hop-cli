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
    console.log('{{Message interface cli}}')
    // this.setwSocket()
    this.connected = false
  }

  /**
  * send message to protocol
  * @method setwSocket
  *
  */
  setwSocket = function () {

    let ws = new WebSocket('wss://127.0.0.1:9888', {
      rejectUnauthorized: false,
      perMessageDeflate: false
    })

    this.messageListener(ws)

    ws.on('connection', function open() {
      console.log('ws open')
      this.connected = true
    })


    ws.on('message', function message(data) {
      console.log('received: %s', data)
    })

    ws.on('close', function closem() {

    })
  }

  /**
  * socket connected?
  * @method checkSocket
  *
  */
  checkSocket = function () {
    console.log('check sockete')
    return this.connected
  }

  /**
  * send message to protocol
  * @method messageListener
  *
  */
   messageListener = function (ws) {
    console.log('message out')
    this.on('hop-m', (messout) => {
      console.log('new message emitted for sending1')
      console.log(messout)
      let startHOP = {}
      startHOP.reftype = 'ignore'
      startHOP.type = messout.text
      startHOP.action = messout.action
      startHOP.data = {}
      let jsonStart = JSON.stringify(startHOP)
      ws.send(jsonStart)
    })
  }

}

export default MessageHOP