// ==========================================================================
// Project:   SCUI - Sproutcore UI Library
// Copyright: ©2009 Evin Grano and contributors.
//            Portions ©2009 Eloqua Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================
/*globals SCUI */

/** @class
  
  A model controller, a class cluster, extends SC.Object, requires a 
  SCUI.Calendar as its 'calendar' property, which if not provided, it will 
  automatically create acconding to its properties. This class is responsible 
  for laying out objects in its calendar within a specific date range. 
  Virtually everything interesting happens in this class. There is a specific 
  SCUI.CalendarLayout for each unique calendar style (day, month, gantt, 
  etc.)
  
  @extends SC.Object
  @author Erich Ocean
  @version 0.1
  @since 0.1
*/
SCUI.CalendarLayout = SC.Object.extend(
/** @scope SCUI.CalendarLayout.prototype */ {
  
  /** @private Walk like a duck. */
  isCalendarLayout: YES,
  
  /** @type SC.Calendar */
  calendar: null
  
});
