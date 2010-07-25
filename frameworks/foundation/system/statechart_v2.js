/*globals SCUI */

SCUI.ROOT_STATE_NAME = "__ROOT_STATE__";

SCUI.StatechartManager = {
  
  trace: NO,
  
  monitorIsActive: NO,
  
  rootState: null,
  
  monitor: null,

  statechartIsInitialized: NO,
  
  initMixin: function() {
    this._registeredStates = [];
    if (this.get('monitorIsActive')) {
      this.set('monitor', SCUI.StatechartMonitor.create());
    }
  },
  
  initStatechart: function() {
    if (this.get('statechartIsInitialized')) return;
    
    var trace = this.get('trace'),
        rootState = this.get('rootState');
    
    if (trace) SC.Logger.info('BEGIN initialize statechart');
    
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
    return this.getPath('rootState.currentSubstates');
  }.property(),
  
  currentStateCount: function() {
    return this.getPath('currentStates.length');
  }.property(),
  
  stateIsCurrentState: function(state) {
    return this.get('rootState').stateIsCurrentSubstate(state);
  },
  
  doesContainState: function(value) {
    return !SC.none(this.getState(value));
  },
  
  getState: function(value) {
    return this._findMatchingState(value, this._registeredStates);
  },
  
  gotoState: function(state, fromCurrentState, useHistory) {
    
    if (!this.get('statechartIsInitialized')) {
      SC.Logger.error('can not go to state %@. statechart has not yet been initialized'.fmt(state));
      return;
    }
    
    var pivotState = null,
        exitStates = [],
        enterStates = [],
        trace = this.get('trace'),
        paramState = state,
        paramFromCurrentState = fromCurrentState;
    
    state = this._findMatchingState(state, this._registeredStates);
    
    if (!SC.none(fromCurrentState)) {
      fromCurrentState =  this._findMatchingState(fromCurrentState, this.get('currentStates'));
      if (SC.none(fromCurrentState)) {
        SC.Logger.error('Can not to goto state %@. %@ is not a recognized current state in statechart'.fmt(paramState, paramFromCurrentState));
        return;
      }
    } 
    else if (this.getPath('currentStates.length') > 0) {
      fromCurrentState = this.get('currentStates')[0];
    }
  
    if (SC.none(state)) {
      SC.Logger.error('Can not to goto state %@. Not a recognized state in statechart'.fmt(paramState));
      return;
    }
        
    if (trace) {
      SC.Logger.info('BEGIN gotoState: %@'.fmt(state));
      SC.Logger.info('starting from current state: %@'.fmt(fromCurrentState));
      SC.Logger.info('current states before: %@'.fmt(this.get('currentStates')));
    }

    if (!SC.none(fromCurrentState)) {
      exitStates = this._createStateChain(fromCurrentState);
    }
    
    enterStates = this._createStateChain(state);
    pivotState = this._findPivotState(exitStates, enterStates);

    if (pivotState) {
      if (trace) SC.Logger.info('pivot state = ' + pivotState);
      if (pivotState.get('substatesAreParallel')) {
        SC.Logger.error('Can not go to state %@. Pivot state %@ has parallel substates.'.fmt(state, pivotState));
        return;
      }
    }
    
    this._traverseStatesToExit(exitStates.shift(), exitStates, pivotState);
    
    if (pivotState !== state) {
      this._traverseStatesToEnter(enterStates.pop(), enterStates, pivotState, useHistory);
    } else {
      this._traverseStatesToExit(pivotState, []);
      this._traverseStatesToEnter(pivotState, null, null, useHistory);
    }
    
    this.set('currentStates', this.get('rootState').currentSubstates);
    
    if (trace) {
      SC.Logger.info('current states after: %@'.fmt(this.get('currentStates')));
      SC.Logger.info('END gotoState: %@'.fmt(state));
    }
  },
  
  gotoHistoryState: function(state, fromCurrentState, recursive) {
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
        this.gotoState(historyState, fromCurrentState);
      } else {
        this.gotoState(state, fromCurrentState);
      }
    } else {
      this.gotoState(state, fromCurrentState, YES);
    }
  },
  
  sendEvent: function(event) {
    
  },

  registerState: function(state) {
    this._registeredStates.push(state);
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
  
  _traverseStatesToExit: function(state, exitStatePath, stopState) {
    if (!state || state === stopState) return;
    
    var trace = this.get('trace');
    
    if (state.get('substatesAreParallel')) {
      var i = 0;
      var states = state.get('currentSubstates');
      var len = states.length;
      
      for (; i < len; i += 1) {
        var chain = this._createStateChain(states[i]);
        this._traverseStatesToExit(chain.shift(), chain, state);
      }
    }
    
    if (state.get('currentSubstates').indexOf(state) >= 0) {  
      var parentState = state.get('parentState');
      while (parentState) {
        parentState.get('currentSubstates').removeObject(state);
        var index = parentState.get('currentSubstates').indexOf(state);
        if (index >= 0) {
          parentState.get('currentSubstates')[index] = null;
          parentState.set('currentSubstates', parentState.get('currentSubstates').compact());
        }
        parentState = parentState.get('parentState');
      }
    }
      
    if (trace) SC.Logger.info('exiting state: ' + state);
    state.exitState();
    if (this.get('monitorIsActive')) this.get('monitor').pushExitedState(state);
    state.set('currentSubstates', []);
    this._traverseStatesToExit(exitStatePath.shift(), exitStatePath, stopState);
  },
  
  _traverseStatesToEnter: function(state, enterStatePath, pivotState, useHistory) {
    if (!state) return;
    
    var trace = this.get('trace');
    
    if (pivotState) {
      if (state !== pivotState) {
        this._traverseStatesToEnter(enterStatePath.pop(), enterStatePath, pivotState, useHistory);
      } else {
        this._traverseStatesToEnter(enterStatePath.pop(), enterStatePath, null, useHistory);
      }
    }
    
    else if (!enterStatePath || enterStatePath.length === 0) {
      this._enterState(state);
      
      var initialSubstate = state.get('initialSubstate'),
          historyState = state.get('historyState');
      
      if (state.get('substatesAreParallel')) {
        this._traverseParallelStatesToEnter(state.get('substates'), null, useHistory);
      }
      else if (state.get('hasSubstates') && historyState && useHistory) {
        this._traverseStatesToEnter(historyState, null, null, useHistory);
      }
      else if (initialSubstate) {
        this._traverseStatesToEnter(initialSubstate, null, null, useHistory);  
      } 
      else {
        var parentState = state;
        while (parentState) {
          parentState.get('currentSubstates').push(state);
          parentState = parentState.get('parentState');
        }
      }
    }
    
    else if (enterStatePath.length > 0) {
      this._enterState(state);
      var nextState = enterStatePath.pop();
      this._traverseStatesToEnter(nextState, enterStatePath, null, useHistory); 
      
      if (state.get('substatesAreParallel')) {
        this._traverseParallelStatesToEnter(state.get('substates'), nextState, useHistory);
      }
    }
  },
  
  _traverseParallelStatesToEnter: function(states, exclude, useHistory) {
    var i = 0,
        len = states.length,
        state = null;
    
    for (; i < len; i += 1) {
      state = states[i];
      if (state !== exclude) this._traverseStatesToEnter(state, null, null, useHistory);
    }
  },
  
  _enterState: function(state) {
    if (this.get('trace')) SC.Logger.info('entering state: ' + state);
    var parentState = state.get('parentState');
    if (parentState && !state.get('isParallelState')) parentState.set('historyState', state);
    state.enterState();
    if (this.get('monitorIsActive')) this.get('monitor').pushEnteredState(state);
  },
  
  _createRootState: function(state, attrs) {
    if (!attrs) attrs = {};
    attrs.statechart = this;
    attrs.name = SCUI.ROOT_STATE_NAME;
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
  },
  
  _monitorIsActiveDidChange: function() {
    if (this.get('monitorIsActive') && SC.none(this.get('monitor'))) {
      this.set('monitor', SCUI.StatechartMonitor.create());
    }
  }.observes('monitorDidChange')
  
};

SCUI.Statechart2 = SC.Object.extend(SCUI.StatechartManager);