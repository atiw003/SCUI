// ==========================================================================
// Project:   SCUI - Sproutcore UI Library
// Copyright: ©2009 Evin Grano and contributors.
//            Portions ©2009 Eloqua Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================
/*globals SCUI */

/** @class
  
  A view controller, a class cluster, extends SC.ArrayController, requires a 
  SCUI.CalendarLayout as its 'layout' object, which if not provided, it will 
  automatically create according to its properties. Most actions (such as 
  advancing to the next day/week/month/year) are on this object.
  
  @extends SC.ArrayController
  @author Erich Ocean
  @version 0.1
  @since 0.1
*/
SCUI.CalendarController = SC.ArrayController.extend(
/** @scope SCUI.CalendarController.prototype */ {
  
  /** @private Walk like a duck. */
  isCalendarController: YES,
  
  /** @type SCUI.CalendarLayout */
  layout: null
  
});
