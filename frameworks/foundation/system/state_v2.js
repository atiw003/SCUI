/*globals SCUI */

/**
  Represents a state within a statechart. 
  
  The statechart actively manages all states belonging to it. When a state is created, 
  it immediately registers itself with the statechart it is owned by. You do 
  not create an instance of a state itself. The statechart manager will go through its 
  state heirarchy and create the states itself.
*/
SCUI.State2 = SC.Object.extend({
  
  /**
    The name of the state
    
    @property {String}
  */
  name: null,
  
  /**
    This state's parent state. Managed by the statechart
    
    @property {State}
  */
  parentState: null,
  
  /**
    This state's history state. Can be null. Managed by the statechart.
    
    @property {State}
  */
  historyState: null,
  
  /**
    Used to indicate the initial substate of this state to enter into. 
    
    You assign the value with the name of the state. Upon creation of 
    the state, the statechart will automatically change the property 
    to be a corresponding state object
    
    The substate is only to be this state's immediate substates.
    
    @property {State}
  */
  initialSubstate: null,
  
  /**
    Used to indicates if this state's immediate substates are to be
    parallel (orthogonal) to each other. 
    
    @property {Boolean}
  */
  substatesAreParallel: NO,
  
  /**
    The immediate substates of this state. Managed by the statechart.
    
    @property {Array}
  */
  substates: null,
  
  /**
    The statechart that this state belongs to. Assigned by the owning
    statechart.
  
    @property {Statechart}
  */
  statechart: null,
  
  /**
    Indicates if this state has been initialized by the statechart
    
    @propety {Boolean}
  */
  stateIsInitialized: NO,
  
  /**
    An array of this state current substates. Managed by the statechart
    
    @propety {Array}
  */
  currentSubstates: null,
  
  /**
    Used to initialize this state. To only be called by the owning statechart.
  */
  initState: function() {
    if (this.get('stateIsInitialized')) return;
    
    var key = null, 
        value = null,
        state = null,
        substates = [],
        matchedInitialSubstate = NO,
        initialSubstate = this.get('initialSubstate'),
        substatesAreParallel = this.get('substatesAreParallel'),
        i = 0,
        len = 0;
    
    // Iterate through all this states substates, if any, create them, and then initialize
    // them. This causes a recursive process.
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
        if (key === initialSubstate) {
          this.set('initialSubstate', state);
          matchedInitialSubstate = YES;
        } 
      }
    }
    
    if (!SC.none(initialSubstate) && !matchedInitialSubstate) {
      SC.Logger.error('Unable to set initial substate %@ since it did not match any of state\'s %@ substates'.fmt(initialSubstate, this));
    }
    
    this.set('substates', substates);
    this.set('currentSubstates', []);
    this.get('statechart')._registerState(this);
    
    if (substates.length === 0) {
      if (!SC.none(initialSubstate)) {
        SC.Logger.warn('Unable to make %@ an initial substate since state %@ has no substates'.fmt(initialSubstate, this));
      }
    } 
    else if (substates.length > 0) {
      if (SC.none(initialSubstate) && !substatesAreParallel) {
        state = substates[0];
        this.set('initialSubstate', state);
        SC.Logger.warn('state %@ has no initial substate defined. Will default to using %@ as initial substate'.fmt(this, state));
      } 
      else if (!SC.none(initialSubstate) && substatesAreParallel) {
        this.set('initialSubstate', null);
        SC.Logger.warn('Can not use %@ as initial substate since substates are all parallel for state %@'.fmt(initialSubstate, this));
      }
    }
    
    this.set('stateIsInitialized', YES);
  },
  
  _createSubstate: function(state, attrs) {
    if (!attrs) attrs = {};
    attrs.parentState = this;
    attrs.statechart = this.get('statechart');
    state = state.create(attrs);
    return state;
  },
  
  /**
    Used to go to a state in the statechart either directly from this state if it is a current state,
    or from one of this state's current substates. Only call this method when this state or one of its 
    substates is a current state.
  */
  gotoState: function(state) {
    // if (this.get('isCurrentState')) {
    //   this.get('statechart').gotoState(state, this);
    //   return;
    // }
    // 
    // var substates = this.get('substates');
    // if (substates.length > 0) {
    //   this.get('statechart').gotoState(state, substates[0]);
    //   return;
    // }
    // 
    // SC.Logger.error('Can not go to state %@ from state %@ since it and none of it substates is a current state'.fmt(state, this));
    // 
    // this.get('statechart').gotoState(state);
    
    this.get('statechart').gotoState(state, this.get('isCurrentState') ? this : null);
  },
  
  /**
    Used to go to a given state's history state in the statechart either directly from this stae if it
    is a current state or from one of the statechart's current states. Ideally, you should only call this
    method when this state is a current state. 
  */
  gotoHistoryState: function(state, recursive) {
    this.get('statechart').gotoHistoryState(state, this.get('isCurrentState') ? this : null, recursive);
  },
  
  /**
    Used to check if a given state is a current substate of this state. Mainly used in cases
    when this state is a parallel state.
    
    @param state {State|String} either a state object or the name of a state
    @returns {Boolean} true is the given state is a current substate, otherwise false is returned
  */
  stateIsCurrentSubstate: function(state) {
    state = this.get('statechart').getState(state);
    return this.get('currentSubstates').indexOf(state) >= 0;
  }, 
  
  /**
    Indicates if this state is the root state of the statechart.
    
    @property {Boolean}
  */
  isRootState: function() {
    return this.getPath('statechart.rootState') === this;
  }.property(),
  
  /**
    Indicates if this state is a current state of the statechart.
    
    @property {Boolean} 
  */
  isCurrentState: function() {
    return this.stateIsCurrentSubstate(this);
  }.property(),
  
  /**
    Indicates if this state is a parallel state
    
    @property {Boolean}
  */
  isParallelState: function() {
    return this.getPath('parentState.substatesAreParallel');
  }.property(),
  
  /**
    Indicate if this state has an substates
    
    @propety {Boolean}
  */
  hasSubstates: function() {
    return this.getPath('substates.length') > 0;
  }.property('substates'),
  
  
  /**
    Used to re-enter this state. Call this only when the state a current state of
    the statechart.  
  */
  reenter: function() {
    var statechart = this.get('statechart');
    if (this.get('isCurrentState')) {
      statechart.gotoState(this);
    } else {
       SC.Logger.error('Can not re-enter state %@ since it is not a current state in the statechart'.fmt(this));
    }
  },
  
  /**
    Called whenever this state is to be entered during a state transition process. 
    
    This is useful when you want the state to perform some initial set up procedures. 
  */
  enterState: function() { },
  
  /**
    Called whenever this state is to be exited during a state transition process. 
    
    This is useful when you want the state to peform some clean up procedures
  */
  exitState: function() { },
  
  toString: function() {
    return "SCUI.State<%@, %@>".fmt(this.get("name"), SC.guidFor(this));
  }
  
});

/**
  Use this when you want to plug-in a state into a statechart. This is beneficial
  in cases where you split your statechart's states up into multiple files.
*/
SCUI.State2.plugin = function(value) {
  var func = function() {
    return SC.objectForPropertyPath(value);
  };
  func.statePlugin = YES;
  return func;
};