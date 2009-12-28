// ==========================================================================
// Project:   SCUI - Sproutcore UI Library
// Copyright: ©2009 Evin Grano and contributors.
//            Portions ©2009 Eloqua Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================
/*globals SCUI */

/**

# Summary

This file documents the SCUI calendar MVC architecture. Their are three 
primary architectural goals:

1. The calendar architecture should be efficient.

2. The calendar architecture should be easy to extend/customize for use in 
   applications.

3. The calendar architecture should be useable in most cases simply by 
   configuring exactly one calendar view instance, not the whole network of 
   objects across the MVC layers required to efficiently draw a calendar.

# Notes

In general, a calendar makes arbitrary records available to a calendar layout 
for rendering. Because each record stores date information under unknown keys,
developers must be allowed to specify the 'firstDateTimeKey' and 
'followingDateTimeKey' for each record type; both should produce an object of 
type SC.DateTime. A SCUI.CalendarViewDelegate should be provided that allows 
the user to declare the key, if the key is not set on the Record class itself.
As a delegate property, the key could also be set on the SCUI.CalendarView.

All records in a calendar occur in a specific timeframe, designated by the 
first *time granule* the record occurs and the first time granule *following* 
the last time granule the record occurs.

A "time granule" is the smallest amount of time that can be recorded.

A record occurring at a single instant in time has first === following. The 
length of time a record occurs in the calendar equals following - first. Here 
are some examples:

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
SC.Record (which SCUI will add) called
overlapsCalendarInRange(calendar, first, following), which either returns NO, 
or a single object (typically the record itself), or an array of objects that 
fall within that calendar. That array can be implemented with lightweight 
objects that proxy to the record for most requests, but know their own first, 
following range.

2. By overriding overlapsCalendarInRange() in your SC.Record instance that can
occur multiple times in a single calendar, you can return an array of proxies.
Note that since a calendar will only attempt to find records within the 
"visible" data range, a "repeating" record will only need to create proxies in
cases where the repeating record would actually be visible.

This arichtecutre is loosly based on the Cocoa Text System. For more 
information on that, see:

- http://developer.apple.com/mac/library/DOCUMENTATION/Cocoa/Conceptual/TextArchitecture/TextArchitecture.html
- http://developer.apple.com/mac/library/DOCUMENTATION/Cocoa/Reference/ApplicationKit/Classes/NSTextView_Class/Reference/Reference.html#//apple_ref/doc/uid/20000373

@author Erich Ocean
@version 0.1
@since 0.1
*/
