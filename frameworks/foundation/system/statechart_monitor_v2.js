/*globals SCUI */

SCUI.StatechartMonitor = SC.Object.extend({
  
  sequence: null,
  
  init: function() {
    this.reset();
  },
  
  reset: function() {
    this.sequence = [];
  },
  
  length: function() {
    return this.sequence.length;
  }.property(),
  
  pushEnteredState: function(state) {
    this.sequence.push({ entered: state });
  },
  
  pushExitedState: function(state) {
    this.sequence.push({ exited: state });
  },
  
  matchSequence: function() {
    return SCUI.StatechartSequenceMatcher.create({
      statechartMonitor: this
    });
  },
  
  toString: function() {
    var seq = "",
        i = 0,
        len = 0,
        item = null;
    
    seq += "[";    

    len = this.sequence.length;
    for (i = 0; i < len; i += 1) {
      item = this.sequence[i];
      if (item.exited) {
        seq += "exited %@".fmt(item.exited.get('name'));
      } 
      else if (item.entered) {
        seq += "entered %@".fmt(item.entered.get('name'));
      } 
      if (i < len - 1) seq += ", ";
    }

    seq += "]";

    return seq;
  }
  
});