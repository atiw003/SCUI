/*globals SCUI */

SCUI.DEFAULT_STATECHART_NAME = "__ROOT_STATE__";

SCUI.StatechartManager = {
  
  trace: NO,
  
  rootState: null,

  statechartIsInitialized: NO,
  
  initMixin: function() {
    this._registeredStates = [];
  },
  
  initStatechart: function() {
    if (this.get('statechartIsInitialized')) return;
    
    var trace = this.get('trace');
    
    if (trace) SC.Logger.info('BEGIN initialize statechart');
    
    var rootState = this.get('rootState');
    
    if (!(SC.kindOf(rootState, SCUI.State2) && rootState.isClass)) {
      throw "Unable to initialize statechart. Root state must be a state class";
    }
    
    rootState = this._createRootState(rootState);
    this.set('rootState', rootState);
    
    rootState.initState();
    
    this.set('statechartIsInitialized', YES);
    
    this.gotoState(rootState);
    
    if (trace) SC.Logger.info('END initialize statechart');
  },
  
  currentStates: function() {
    return this.get('rootState')._currentChildStates;
  }.property(),
  
  currentState: function(state) {
    return this.get('rootState').currentState(state);
  },
  
  doesContainState: function(value) {
    return !SC.none(this.getState(value));
  },
  
  getState: function(value) {
    return this._findMatchingState(value, this._registeredStates);
  },
  
  gotoState: function(state, useHistory) {
    if (!this.get('statechartIsInitialized')) {
      SC.Logger.error('can not go to state %@. statechart has not yet been initialized'.fmt(state));
      return;
    }
    
    var pivotState = null,
        exitStates = [],
        enterStates = [],
        trace = this.get('trace'),
        paramState = state;
    
    state = this._findMatchingState(state, this._registeredStates);
  
    if (!state) {
      SC.Logger.error('Can not to goto state %@. Not a recognized state in statechart'.fmt(paramState));
      return;
    }
        
    if (trace) SC.Logger.info('BEGIN gotoState: ' + state);
    if (trace) SC.Logger.info('current states before: ' + this.get('currentStates'));

    if (this.getPath('currentStates.length') > 0) {
      exitStates = this._createStateChain(this.get('currentStates')[0]);
    }
    
    enterStates = this._createStateChain(state);
    pivotState = this._findPivotState(exitStates, enterStates);

    if (pivotState && trace) SC.Logger.info('pivot state = ' + pivotState);
    
    this._walkExitStates(exitStates.shift(), exitStates, pivotState);
    
    if (pivotState !== state) {
      this._walkEnterStates(enterStates.pop(), enterStates, pivotState, useHistory);
    } else {
      this._walkExitStates(pivotState, []);
      this._walkEnterStates(pivotState, null, null, useHistory);
    }
    
    this.set('currentStates', this.get('rootState')._currentChildStates);
    
    if (trace) SC.Logger.info('current states after: ' + this.get('currentStates'));
    if (trace) SC.Logger.info('END gotoState: ' + state);
  },
  
  gotoHistoryState: function(state, recursive) {
    if (!this.get('statechartIsInitialized')) {
      SC.Logger.error("can not go to state %@'s history state . statechart has not yet been initialized".fmt(state));
      return;
    }
    
    state = this._findMatchingState(state, this._registeredStates);
  
    if (!state) {
      SC.Logger.error("Can not to goto state %@'s history state. Not a recognized state in statechart".fmt(state));
      return;
    }
    
    var historyState = state.get('historyState');
    
    if (!recursive) { 
      if (historyState) {
        this.gotoState(historyState);
      } else {
        this.gotoState(state);
      }
    } else {
      this.gotoState(state, YES);
    }
  },
  
  sendEvent: function(event) {
    
  },

  registerState: function(state) {
    this._registeredStates.push(state);
    state._currentChildStates = [];
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
  
  _walkExitStates: function(state, exitStatePath, stopState) {
    if (!state || !state.get('parentState') || state === stopState) return;
    
    var trace = this.get('trace');
    
    if (state.get('parallelSubstates')) {
      var i = 0;
      var states = state._currentChildStates;
      var len = states.length;
      
      for (; i < len; i += 1) {
        var chain = this._createStateChain(states[i]);
        this._walkExitStates(chain.shift(), chain, state);
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
      
    if (trace) SC.Logger.info('exiting state: ' + state);
    state.exitState();
    state._currentChildStates = [];
    this._walkExitStates(exitStatePath.shift(), exitStatePath, stopState);
  },
  
  _walkEnterStates: function(state, enterStatePath, pivotState, useHistory) {
    if (!state) return;
    
    var trace = this.get('trace');
    
    if (pivotState) {
      if (state !== pivotState) {
        this._walkEnterStates(enterStatePath.pop(), enterStatePath, pivotState, useHistory);
      } else {
        this._walkEnterStates(enterStatePath.pop(), enterStatePath, null, useHistory);
      }
    }
    
    else if (!enterStatePath || enterStatePath.length === 0) {
      this._enterState(state);
      
      var initialSubstate = state.get('initialSubstate'),
          historyState = state.get('historyState');
      
      if (state.get('parallelSubstates')) {
        this._walkParallelEnterStates(state.get('substates'), null, useHistory);
      }
      else if (state.get('hasSubstates') && historyState && useHistory) {
        this._walkEnterStates(historyState, null, null, useHistory);
      }
      else if (initialSubstate) {
        this._walkEnterStates(initialSubstate, null, null, useHistory);  
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
      this._enterState(state);
      var nextState = enterStatePath.pop();
      this._walkEnterStates(nextState, enterStatePath, null, useHistory); 
      
      if (state.get('parallelSubstates')) {
        this._walkParallelEnterStates(state.get('substates'), nextState, useHistory);
      }
    }
  },
  
  _walkParallelEnterStates: function(states, exclude, useHistory) {
    var i = 0,
        len = states.length,
        state = null;
    
    for (; i < len; i += 1) {
      state = states[i];
      if (state !== exclude) this._walkEnterStates(state, null, null, useHistory);
    }
  },
  
  _enterState: function(state) {
    if (this.get('trace')) SC.Logger.info('entering state: ' + state);
    var parentState = state.get('parentState');
    if (!state.get('isParallelState') && parentState) parentState.set('historyState', state);
    state.enterState();
  },
  
  _createRootState: function(state, attrs) {
    if (!attrs) attrs = {};
    attrs.statechart = this;
    attrs.name = SCUI.DEFAULT_STATECHART_NAME;
    state = state.create(attrs);
    return state;
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

SCUI.Statechart2 = SC.Object.extend(SCUI.StatechartManager);