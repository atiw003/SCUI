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
  
  "Instantaneous" events should have first === following. It is an error if 
  first > following.
  
  This mixin is automatically applied to SC.Record.
  
  @author Erich Ocean
  @version 0.1
  @since 0.1
*/
SCUI.CalendarEvent = {
  
  /**
    A property key resolving to an SC.DateTime object specifying the first 
    second this calendar event appears in the calendar.
    
    @type String
  */
  firstDateTimeKey: 'firstDateTime',
  
  /**
    A property key resolving to an SC.DateTime object specifying the second 
    following the time period this calendar event appears in the calendar.
    
    @type String
  */
  followingDateTimeKey: 'followingDateTime',
  
  /**
    Return NO if the calendar event does not overlap the specified calendar 
    in the range [first, following). Otherwise, return either the receiver 
    or return an array of objects that implement the SCUI.CalendarEvent mixin.
    
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

SC.mixin(SC.Record.prototype, SCUI.CalendarEvent);
