// ==========================================================================
// Project:   SCUI - Sproutcore UI Library
// Copyright: ©2009 Evin Grano and contributors.
//            Portions ©2009 Eloqua Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================
/*globals SCUI */

/** @namespace
  
  Every object obtained through SCUI.Calendar implements this interface. They 
  are not necessarily SC.Record instances (sometimes proxies are used).
  
  This class is automatically applied to SC.Record.
  
  @author Erich Ocean
  @version 0.1
  @since 0.1
*/
SCUI.CalendarEntry = {
  
  /**
    A property key resolving to an SC.DateTime object specifying the first 
    second this calendar entry appears in the calendar.
    
    @type String
  */
  firstDateTimeKey: 'firstDateTime',
  
  /**
    A property key resolving to an SC.DateTime object specifying the second 
    following the time period this calendar entry appears in the calendar.
    
    @type String
  */
  followingDateTimeKey: 'followingDateTime',
  
  /**
    Return NO if the calendar entry does not overlap the specified calendar 
    in the range [first, following). Otherwise, return either the receiver 
    or return an array of objects that implement the SCUI.CalendarEntry mixin.
    
    @param calendar SCUI.Calendar the calandar to overlap
    @param first SC.DateTime the first second in the time period to overlap 
      in calendar
    @param following SC.DataTime the second following the time period to 
      overlap in calendar
    @returns {NO, SCUI.CalendarEntry, or SC.Array}
  */
  overlapsCalendarInRange: function(calendar, first, following) {
    throw "FIXME: Not implemented." ;
  }
  
};

SC.mixin(SC.Record.prototype, SCUI.CalendarEntry);
