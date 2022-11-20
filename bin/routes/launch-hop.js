'use strict'
/**
*  cli bring to life HOP
*
*
* @class LaunchHOP
* @package    LaunchHOP
* @copyright  Copyright (c) 2022 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import util from 'util'
import EventEmitter from 'events'
import LiveHOP from 'hop'

class LaunchHOP extends EventEmitter {

  constructor() {
    super()
    console.log('{{Launch interface HOP cli}}')
    this.liveSF = {}
  }

  /**
  * start safeflowECS with port number
  * @method startSFECS
  *
  */
  startSFECS = function (options) {
    // let hopSF = new LiveHOP(options)
  }
}

export default LaunchHOP
