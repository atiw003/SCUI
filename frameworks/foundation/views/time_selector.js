//============================================================================
// SCUI.TimeSelectorFieldView
//============================================================================
/*globals SCUI*/

/**

 TODO
 @extends SC.View
 @author Jason Dooley
 @version GA
 @since GA
 
 Example:
 
 timeSelector: SCUI.TimeSelectorFieldView.design({
   layout: { left: 0, top: 0, height: 24 },
   valueBinding: 'App.yourController.timeField'
 })
 
 {@value expects SC.DateTime}
 

*/
SCUI.TimeSelectorFieldView = SC.View.extend(
 /** @scope SCUI.TimeSelectorFieldView.prototype */{
   
  classNames: ['scui-timeselector'],
    
  // this can be styled, but for the time being, need a
  // min width and height to fit everything in conveniently
  layout: { minHeight: 24, minWidth: 100 },
    
  // convenience function to toggle meridian on click
  _toggleMeridian: function () {
    var mer = this.get('meridian');
    mer = (mer == 'PM') ? 'AM' : 'PM';
    this.set('meridian', mer);
  },
    
  // get or set time
  time: null,
  
  // get or set 'AM' 'PM'
  meridian: null,
  
  value: function (key, value) {
    if (value !== undefined) {

    } else {
      var time = this.get('time');
      var meridian = this.get('meridian');
      if (meridian === 'PM') time = time + 12 * 60 * 60;
      else if (meridian !== 'AM') return null;
      
      var datetime = SC.DateTime.create({ second: time });
    }
    
    return datetime;
  }.property('time', 'meridian').cacheable(),
  
  // base time text field settings
  timeView: SC.TextFieldView.design({
    classNames: ['scui-timeselector-time'],
    layout: {width: 53,top: 0,bottom: 0,left: 0},
    textAlign: SC.ALIGN_right
  }),
  
  // base 'AM' 'PM'
  meridianView: SC.TextFieldView.design({
    classNames: ['scui-timeselector-meridian'],
    layout: {width: 30,top: 0,bottom: 0,left: 58},
    textAlign: SC.ALIGN_CENTER,
    hint: 'PM'
  }),
  
  // setup the entire view
  createChildViews: function () {
    var childViews = [], view;
    var that = this;
    
    // Time view
    view = this.get('timeView');
    if (SC.kindOf(view, SC.View)) {
      view = this.createChildView(view, {
        valueBinding: SC.Binding.from('time', this),
        isEnabledBinding: SC.Binding.from('isEnabled',this),
        validator: SCUI.Validators.Time,
        allowsErrorAsValue: NO,
        continuouslyUpdatesValue: NO
      });
      childViews.push(view);
    }
    else {
      view = null;
    }
    this.set('timeView', view);
    
    // Meridian View
    view = this.get('meridianView');
    if (SC.kindOf(view, SC.View)) {
      view = this.createChildView(view, {
        valueBinding: SC.Binding.from('meridian', this),
        isEnabledBinding: SC.Binding.from('isEnabled',this),
        mouseDown: function () {
          that._toggleMeridian();
        }
      });
      childViews.push(view);
    }
    else {
      view = null;
    }
    this.set('meridianView', view);
    
    this.set('childViews', childViews);
  }
});