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
    console.log('{{Message cli}}')

    const ws = new WebSocket('wss://127.0.0.1:9888', {
      rejectUnauthorized: false
    })

    ws.on('open', function open() {
      console.log('ws open')
    })

    ws.on('message', function message(data) {
      console.log('received: %s', data);
    })
  }

  /**
  * send message to protocol
  * @method sendMessage
  *
  */
  sendMessage = function (message) {
    console.log('message out')
    let startHOP = {}
    startHOP.reftype = 'ignore'
    startHOP.type = 'launch'
    let jsonStart = JSON.stringify(startHOP)
    ws.send(jsonStart)
  }

}

export default MessageHOP