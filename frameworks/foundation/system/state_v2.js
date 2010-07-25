/*globals SCUI */

SCUI.State2 = SC.Object.extend({
  
  name: null,
  
  parentState: null,
  
  historyState: null,
  
  initialSubstate: null,
  
  substatesAreParallel: NO,
  
  substates: null,
  
  statechart: null,
  
  stateIsInitialized: NO,
  
  currentSubstates: null,
  
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
        state = this._createSubstate(value, { name: key });
        substates.push(state);
        this[key] = state;
        state.initState();
        if (key === initialSubstate) this.set('initialSubstate', state);
      }
    }
    
    this.set('substates', substates);
    this.set('currentSubstates', []);
    this.get('statechart').registerState(this);
    
    this.set('stateIsInitialized', YES);
  },
  
  _createSubstate: function(state, attrs) {
    if (!attrs) attrs = {};
    attrs.parentState = this;
    attrs.statechart = this.get('statechart');
    state = state.create(attrs);
    return state;
  },
  
  gotoState: function(state) {
    this.get('statechart').gotoState(state, this.get('isCurrentState') ? this : null);
  },
  
  gotoHistoryState: function(state, recursive) {
    this.get('statechart').gotoHistoryState(state, this.get('isCurrentState') ? this : null, recursive);
  },
  
  stateIsCurrentSubstate: function(state) {
    state = this.get('statechart').getState(state);
    return this.get('currentSubstates').indexOf(state) >= 0;
  }, 
  
  isRootState: function() {
    return this.getPath('statechart.rootState') === this;
  }.property(),
  
  isCurrentState: function() {
    return this.stateIsCurrentSubstate(this);
  }.property(),
  
  isParallelState: function() {
    return this.getPath('parentState.substatesAreParallel');
  }.property(),
  
  hasSubstates: function() {
    return this.getPath('substates.length') > 0;
  }.property('substates'),
  
  reenter: function() {
    var statechart = this.get('statechart');
    if (statechart.stateIsCurrentState(this)) {
      statechart.gotoState(this);
    } else {
       SC.Logger.error('Can not re-enter state %@ since it is not a current state in the statechart'.fmt(this));
    }
  },
  
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