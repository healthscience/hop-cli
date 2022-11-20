'use strict'
/**
*  cli to communicate with library
*
*
* @class LibraryHOP
* @package    LibraryHOP
* @copyright  Copyright (c) 2022 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import util from 'util'
import EventEmitter from 'events'

class LibraryHOP extends EventEmitter {

  constructor() {
    super()
    console.log('{{Library interface HOP cli}}')
  }
}

export default LibraryHOP