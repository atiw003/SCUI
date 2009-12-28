// ==========================================================================
// Project:   SCUI - Sproutcore UI Library
// Copyright: ©2009 Evin Grano and contributors.
//            Portions ©2009 Eloqua Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================
/*globals SCUI */

/** @class
  
  A model, extends SC.RecordArray, this object contains the calendar "entries"
  that will be rendered by SCUI.CalendarLayouts and drawn in 
  SCUI.CalendarViews. To change what is ultimately rendered, simply change the
  'calendar' property of the appropriate SCUI.CalendarLayout instance; 
  everything will update as expected. Since a SCUI.Calendar monitors the store
  (like all SC.RecordArrays), any updates to SC.Records in the store that 
  affect the rendering will cause the display to update at the end of the run 
  loop.
  
  Note: because of the layered MVC architecture, only updates to records in a 
  calendar that are currently *visible* will cause a re-render.
  
  A record occurring at a single instant in time has first === following. The 
  length of time a record occurs in the calendar equals following - first. 
  Here are some examples:
  
  - all day, December 1, 2009:
    - first: December 1, 12:00 AM, 2009
    - following: December 2, 12:00 AM, 2009
  
  - the entire month of February, 2010
    - first: February 1, 2010
    - following: March 1, 2010
  
  Repeating records (records that can occur multiple times) are simple to 
  implement, as follows:
  
  1. "matching" a record to a calendar is done based on the first, following 
     keys by default, but the *actual* match is done by a special method on 
     SC.Record called overlapsCalendarInRange(calendar, first, following), 
     which either returns NO, or a single object (typically the record 
     itself), or an array of objects that fall within that calendar. That 
     array can be implemented with lightweight objects that proxy to the 
     record for most requests, but know their own first, following range.
  
  2. By overriding overlapsCalendarInRange() in your SC.Record instance that 
     can occur multiple times in a single calendar, you can return an array of
     proxies. Note that since a calendar will only attempt to find records 
     within the "visible" data range, a "repeating" record will only need to 
     create proxies in cases where the repeating record would actually be 
     visible.
  
  @extends SC.RecordArray
  @author Erich Ocean
  @version 0.1
  @since 0.1
*/
SCUI.Calendar = SC.RecordArray.extend(
/** @scope SCUI.Calendar.prototype */ {
  
});
