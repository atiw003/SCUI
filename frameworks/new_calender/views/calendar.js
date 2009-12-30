// ==========================================================================
// Project:   SCUI - Sproutcore UI Library
// Copyright: ©2009 Evin Grano and contributors.
//            Portions ©2009 Eloqua Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================
/*globals SCUI */

/** @class
  
  A view, extends SC.CollectionView, requires a SCUI.CalendarController as 
  its 'content' property, which if not provided, it will automatically create 
  according to its properties. Most properties and actions available on the 
  remaining objects in the calendar network have shadown properties and 
  actions on SCUI.CalendarView that forward to the appropriate object.
  
  Virtually everything interesting happens in this class. There 
  is a specific SCUI.CalendarView subclass for each unique calendar style 
  (day, month, gantt, etc.).
  
  @extends SC.CollectionView
  @author Erich Ocean
  @version 0.1
  @since 0.1
*/
SCUI.CalendarView = SC.CollectionView.extend(
/** @scope SCUI.CollectionView.prototype */ {
  
  /** @private Walk like a duck. */
  isCalendarView: YES,
  
  /** @type SC.DateTime */
  epoch: function(key, value) {
    var content = this.get('content') ;
    if (value !== undefined) {
      if (content) content.set('epoch', value) ;
    } else {
      return content ? content.get('epoch') : null ;
    }
  }.property('*content.epoch').cacheable(),
  
  /** @type SCUI.GRANULARITY a String */
  granularity: function(key, value) {
    var content = this.get('content') ;
    if (value !== undefined) {
      if (content) content.set('granularity', value) ;
    } else {
      return content ? content.get('granularity') : null ;
    }
  }.property('*content.granularity').cacheable()
  
});
