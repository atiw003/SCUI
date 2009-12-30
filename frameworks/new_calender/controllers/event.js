// ==========================================================================
// Project:   SCUI - Sproutcore UI Library
// Copyright: ©2009 Evin Grano and contributors.
//            Portions ©2009 Eloqua Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================
/*globals SCUI */

/** @class
  
  A model controller, extends SC.ArrayController, requires a SCUI.Calendar as 
  its 'calendar' property, which if not provided, it will automatically create
  acconding to its properties. This class is responsible for determining which
  events in its calendar are within the date ranges of its calendar 
  controllers.
  
  It is also responsible for managing event selections and notifying 
  observing calendar controllers whenever an event's schedule changes.
  
  @extends SC.ArrayController
  @author Erich Ocean
  @version 0.1
  @since 0.1
*/
SCUI.EventController = SC.ArrayController.extend(
/** @scope SCUI.EventController.prototype */ {
  
  /** @private Walk like a duck. */
  isEventController: YES,
  
  /** @type SC.Calendar */
  calendar: null
  
});
