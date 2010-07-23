/*globals SCUI */

SCUI.Statechart2 = {
  
  rootState: null,
  
  currentStates: null,
  
  initMixin: function() {
    this._isInitialized = NO;
    this._registeredStates = [];
    this.currentStates = [];
  },
  
  initialize: function() {
    if (this._isInitialized) return;
    
    console.info('BEGIN initialize statechart');
    
    var rootState = this.get('rootState');
    
    if (!(SC.kindOf(rootState, SCUI.State2) && rootState.isClass)) {
      throw "Unable to initialize statechart. Root state must be a state class";
    }
    
    rootState = this.createRootState(rootState);
    this.set('rootState', rootState);
    
    rootState.initialize();
    
    this.gotoState(rootState);
    
    this._isInitialized = YES;
    
    console.info('END initialize statechart');
  },
  
  createRootState: function(state, attrs) {
    if (!attrs) attrs = {};
    attrs.statechart = this;
    attrs.name = "__root_state__";
    state = state.create(attrs);
    return state;
  },
  
  gotoState: function(state) {
    var pivotState = null,
        exitStates = [],
        enterStates = [];
    
    state = this._findMatchingState(state, this._registeredStates);
  
    if (!state) {
      console.warn('Can not to goto state %@. Not a recognized state in this statechart'.fmt(state));
      return;
    }
        
    console.info('BEGIN gotoState: ' + state);
    console.info('current states before: ' + this.currentStates);
    
    if (this.get('currentStates').length > 0) {
      exitStates = this._createStateChain(this.currentStates[0]);
    }
    
    enterStates = this._createStateChain(state);
    pivotState = this._findPivotState(exitStates, enterStates);
    
    if (pivotState) {
      console.info('pivot state = ' + pivotState);
      if (pivotState.get('parallelSubstates')) {
        console.error('cannot goto state %@ since pivot state %@ has parallel substates'.fmt(state, pivotState));
        return;
      }
    }
    
    this._exitState(exitStates.shift(), exitStates, pivotState);
    this._enterState(enterStates.pop(), enterStates, pivotState);
    
    this.set('currentStates', this.get('rootState')._currentChildStates);
    
    console.info('current states after: ' + this.currentStates);
    console.info('END gotoState: ' + state);
  },
  
  sendEvent: function(event) {
    
  },
  
  currentState: function(value) {
    return !SC.none(this._findMatchingState(value, this.get('currentStates')));
  },
  
  registerState: function(state) {
    this._registeredStates.push(state);
    state._currentChildStates = [];
  },
  
  containsState: function(value) {
    return !SC.none(this.getState(value));
  },
  
  getState: function(value) {
    return this._findMatchingState(value, this._registeredStates);
  },
  
  _createStateChain: function(state) {
    var chain = [];
    
    while (state) {
      chain.push(state);
      state = state.get('parentState');
    }
    
    return chain;
  },
  
  _findPivotState: function(stateChain1, stateChain2) {
    if (stateChain1.length === 0 || stateChain2.length === 0) return null;
    
    var pivot = stateChain1.find(function(state, index) {
      if (stateChain2.indexOf(state) >= 0) return YES;
    });
    
    return pivot;
  },
  
  _exitState: function(state, exitStatePath, stopState) {
    if (!state || !state.get('parentState') || state === stopState) return;
    
    if (state.get('parallelSubstates')) {
      var i = 0;
      var states = state._currentChildStates;
      var len = states.length;
      
      for (; i < len; i += 1) {
        var chain = this._createStateChain(states[i]);
        this._exitState(chain.shift(), chain, state);
      }
    }
    
    if (state._currentChildStates.indexOf(state) >= 0) {  
      var parentState = state.get('parentState');
      while (parentState) {
        parentState._currentChildStates.removeObject(state);
        var index = parentState._currentChildStates.indexOf(state);
        if (index >= 0) {
          parentState._currentChildStates[index] = null;
          parentState._currentChildStates = parentState._currentChildStates.compact();
        }
        parentState = parentState.get('parentState');
      }
    }
      
    console.log('exiting state: ' + state);
    state.exitState();
    state._currentChildStates = [];
    this._exitState(exitStatePath.shift(), exitStatePath, stopState);
  },
  
  _enterState: function(state, enterStatePath, pivotState) {
    if (!state) return;
    
    if (pivotState) {
      if (state !== pivotState) {
        this._enterState(enterStatePath.pop(), enterStatePath, pivotState);
      } else {
        this._enterState(enterStatePath.pop(), enterStatePath, null);
      }
    }
    
    else if (!enterStatePath || enterStatePath.length === 0) {
      console.log('entering state: ' + state);
      state.enterState();
      
      var initialSubstate = state.get('initialSubstate');
      
      if (state.get('parallelSubstates')) {
        this._enterStates(state.get('substates'));
      }
      else if (initialSubstate) {
        this._enterState(initialSubstate);
      }
      else {
        var parentState = state;
        while (parentState) {
          parentState._currentChildStates.push(state);
          parentState = parentState.get('parentState');
        }
      }
    }
    
    else if (enterStatePath.length > 0) {
      console.log('entering state: ' + state);
      state.enterState();
      var nextState = enterStatePath.pop();
      this._enterState(nextState, enterStatePath); 
      
      if (state.get('parallelSubstates')) {
        this._enterStates(state.get('substates'), nextState);
      }
    }
  },
  
  _enterStates: function(states, exclude) {
    var i = 0;
    var len = states.length;
    
    for (; i < len; i += 1) {
      var state = states[i];
      if (state !== exclude) this._enterState(state);
    }
  },
  
  _findMatchingState: function(value, states) {
    if (SC.none(value)) return null;
    
    var state = null,
        i = 0,
        len = states.length,
        valueIsString = (SC.typeOf(value) === SC.T_STRING),
        valueIsObject = (SC.typeOf(value) === SC.T_OBJECT);
        
    for (; i < len; i += 1) {
      state = states[i];
      if (valueIsString) {
        if (state.get('name') === value) return state;
      } else if (valueIsObject) {
        if (state === value) return state;
      }
    }
    
    return null;
  }
  
};