/*globals SCUI */

SCUI.StatechartSequenceMatcher = SC.Object.extend({
  
  statechartMonitor: null,
  
  position: 0,
  
  match: YES,
  
  begin: function() {
    this.position = -1;
    this.match = YES;
    return this;
  },
  
  end: function() {
    return this.match;
  },
  
  entered: function() {
    return this._doCheck('entered', arguments);
  },
  
  exited: function() {
    return this._doCheck('exited', arguments);
  },
  
  _doCheck: function(event, args) {
    var i = 0,
        len = args.length,
        seqItem = null,
        arg = null,
        seq = this.statechartMonitor.sequence;
        
    for (; i < len; i += 1) {
      this.position += 1;
  
      if (this.position >= seq.length) {
        this.match = NO;
        return this;
      }
      
      seqItem = seq[this.position];
      if (!seqItem[event]) {
        this.match = NO;
        return this;
      }
      
      arg = args[i];
      if (SC.typeOf(arg) === SC.T_OBJECT) {
        if (seqItem[event] !== arg) {
          this.match = NO;
          return this;
        }
      } 
      else if (seqItem[event].get('name') !== arg) {
        this.match = NO;
        return this;
      }
    }
  
    return this;
  }
  
});