// ========================================================================
// SCUI.Validators.Time
// ========================================================================

/**
  Validator for 12-hour time (without AM/PM).  
  Converts to and from a 12 hour string (ex 9:00) to amount of seconds
  
  @author Mike Ball
  @version Beta1.1
  @since Beta1.1
*/

SCUI.Validators.Time = SC.Validator.extend({
  
  regex: /^[01]?[0-9](:[0-5][0-9])?$/,
  
  _minutesEntered: YES,  
  
  fieldValueForObject: function(object, field, isPartial) { 
    var ret = object;
    
    if (!SC.none(object) && (isPartial === NO || this._transformBack === YES)) {
      var minutes = object%(60*60)/60;
      var padder = minutes < 10 ? '0' : '';
      var hours = (object - (minutes*60))/60/60;
      if (hours === 0) hours = 12;
      if (this._minutesEntered === YES) {
        ret = (hours + ':' + padder + minutes);
      }
      else {
        ret = hours;
      }
      
      this._transformBack = NO;
    }
    
    return ret;
  },
  
  objectForFieldValue: function(fieldValue, field, isPartial) { 
    var matcher = this.get('regex'),
        ret = fieldValue;
    if(!matcher.test(fieldValue)) {
      ret = SC.Error.create({errorValue: fieldValue, message: "Please enter a valid time."});
    }
    else {
      var timeComponents = fieldValue.split(":");
      var hours = timeComponents[0];

      if (hours*1 > 12) {
        return SC.Error.create({errorValue: fieldValue, message: "Please enter a valid time."});
      }
      else if (hours*1 === 12) {
        hours = 0;
      }
      
      var minutes = 0;
      if (timeComponents.length > 1) {
        minutes = timeComponents[1];
        this._minutesEntered = YES;
      }
      else {
        this._minutesEntered = NO;
      }
      
      ret = (hours * 60 * 60) + (minutes * 60);
      this._transformBack = YES;
    }

    return ret;
  }
});

