/*globals SCUI */

SCUI.State2 = SC.Object.extend({
  
  name: null,
  
  parentState: null,
  
  historyState: null,
  
  initialSubstate: null,
  
  parallelSubstates: NO,
  
  substates: null,
  
  statechart: null,
  
  stateIsInitialized: NO,
  
  initState: function() {
    if (this.get('stateIsInitialized')) return;
    
    var key = null, 
        value = null,
        state = null,
        substates = [],
        initialSubstate = this.get('initialSubstate'),
        i = 0,
        len = 0;
    
    for (key in this) {
      value = this[key];
      
      if (SC.typeOf(value) === SC.T_FUNCTION && value.statePlugin) {
        value = value.apply(this);
      }
      
      if (SC.kindOf(value, SCUI.State2) && value.isClass && this[key] !== this.constructor) {
        state = this.createSubstate(value, { name: key });
        substates.push(state);
        this[key] = state;
        state.initState();
        if (key === initialSubstate) this.set('initialSubstate', state);
      }
    }
    
    this.set('substates', substates);
    this.get('statechart').registerState(this);
    
    this.set('stateIsInitialized', YES);
  },
  
  createSubstate: function(state, attrs) {
    if (!attrs) attrs = {};
    attrs.parentState = this;
    attrs.statechart = this.get('statechart');
    state = state.create(attrs);
    return state;
  },
  
  gotoState: function(state) {
    this.get('statechart').gotoState(state);
  },
  
  gotoHistoryState: function(recursive) {
    this.get('statechart').gotoHistoryState(this, recursive);
  },
  
  currentState: function(state) {
    state = this.get('statechart').getState(state);
    return this._currentChildStates.indexOf(state) >= 0;
  }, 
  
  isRootState: function() {
    return this.getPath('statechart.rootState') === this;
  }.property(),
  
  isCurrentState: function() {
    return this.currentState(this);
  }.property(),
  
  isParallelState: function() {
    return this.getPath('parentState.parallelSubstates');
  }.property(),
  
  enterState: function() { },
  
  exitState: function() { },
  
  toString: function() {
    return "SCUI.State<%@, %@>".fmt(this.get("name"), SC.guidFor(this));
  }
  
});

SCUI.State2.plugin = function(value) {
  var func = function() {
    return SC.objectForPropertyPath(value);
  };
  func.statePlugin = YES;
  return func;
};