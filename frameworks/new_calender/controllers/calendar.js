// ==========================================================================
// Project:   SCUI - Sproutcore UI Library
// Copyright: ©2009 Evin Grano and contributors.
//            Portions ©2009 Eloqua Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================
/*globals SCUI */

/** @class
  
  A view controller, extends SC.ArrayController, requires a 
  SCUI.EventController as its 'events' object, which if not provided, it will 
  automatically create according to its properties. Most actions (such as 
  advancing to the next day/week/month/year) are on this object.
  
  This controller exports 'nowShowing' and 'selection' in terms of these two 
  properties:
    - 'nowShowing' is in terms of datetime granules relative to 'epoch'
    - 'selection' is against these datatime granules
  
  If you need to get selected events in the calendar, you should access the 
  SCUI.EventController object assigned to this controller's 'events' property.
  
  @extends SC.ArrayController
  @author Erich Ocean
  @version 0.1
  @since 0.1
*/
SCUI.CalendarController = SC.ArrayController.extend(
/** @scope SCUI.CalendarController.prototype */ {
  
  /** @private Walk like a duck. */
  isCalendarController: YES,
  
  /** @type SCUI.EventController */
  events: null,
  
  /** @type SC.DateTime defaults to Dec 28, 1969 */
  epoch: SC.DateTime.create({ year: 1969, month: 12, day: 28, timezone: 0 }),
  
  /** @type SCUI.GRANULARITY a String; defaults to 'day' granularity */
  granularity: SCUI.DAY_GRANULARITY,
  
  /** @type SCUI.EventController */
  events: null
  
});
