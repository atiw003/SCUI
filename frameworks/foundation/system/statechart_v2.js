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
    
    if (pivotState) console.info('pivot state = ' + pivotState);
    
    this._exitStates(exitStates, pivotState);
    this._enterStates(enterStates, pivotState);
    
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
  
  _exitStates: function(stateChain, pivotState) {
    var state = null,
        len = stateChain.length,
        i = 0;
    
    if (!pivotState) return;
    
    for (; i < len; i += 1) {
      state = stateChain[i];
      if (state === pivotState) break;
      console.info('exiting state: ' + state);
      state.exitState();
    }
  },
  
  _enterStates: function(stateChain, pivotState) {
    var state = null,
        substate = null,
        len = stateChain.length,
        i = len - 1,
        hitPivot = NO;
        
    for (; i >= 0; i -= 1) {
      state = stateChain[i];
      if (pivotState && !hitPivot) {
        if (state === pivotState) hitPivot = YES;
        continue;
      }
      
      console.info('entering state: ' + state);
      state.enterState();
    }
    
    while (state) {
      substate = state.get('initialSubstate');
      if (!substate) break;
      console.info('entering initial substate: ' + substate);
      substate.enterState();
      state = substate;
    }
    
    this.set('currentStates', [state]);
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