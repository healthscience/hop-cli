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
  * build query for library
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
  
    /**
  * build query for SafeFlow ECS
  * @method formExperiment
  *
  */
  formExperiment = function (input) {
    // test nxp input data  need to input library tools to build query
    let testNXP = {}
    testNXP.refcontract = input.refcont // '215b967596da807c95d4fd47c0795d03f45e0eca' // 10e83ff06ab53f3563e4f46d48b2eef94dcb8ae6
    let query= {}
    query.type = 'library'
    query.reftype = input.type
    query.action = 'GET'
    query.data = testNXP
    return query
  }
}
export default LibraryHOP


// f020a98b100ac40c109a1488220e9874cfa3f43a  -- compute