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
    this.live = true
  }

  /**
  * check library is live
  * @method checkLibrary
  *
  */
  checkLibrary = function (options) {
    return true
  }

  /**
  * build query for SafeFlow ECS
  * @method formQuery
  *
  */
  formQuery = function (input) {
    let query= {}
    query.type = 'library'
    query.reftype = input.type
    query.action = 'GET'
    query.data = input.refcont
  return query
}

}
export default LibraryHOP