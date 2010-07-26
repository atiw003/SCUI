// ==========================================================================
// SCUI.State Unit Test
// ==========================================================================
/*globals SCUI externalState1 externalState2 */

/**
  @author Michael
*/
var statechart = null;
externalState1 = null;
externalState2 = null;

// ..........................................................
// CONTENT CHANGING
// 

module("SCUI.Statechart Mixin: Basic Unit test", {
  setup: function() {
    
    externalState1 = SCUI.State2.extend({
      
      message: 'external state 1'
      
    });
    
    externalState2 = SCUI.State2.extend({
      
      initialSubstate: 'd',
      
      message: 'external state 2',
      
      d: SCUI.State2.design(),
      
      e: SCUI.State2.plugin('externalState1')
      
    });
    
    statechart = SCUI.Statechart2.create({
      
      monitorIsActive: YES,
      
      rootState: SCUI.State2.design({
        
        initialSubstate: 'a',
        
        a: SCUI.State2.plugin('externalState1'),
        
        b: SCUI.State2.plugin('externalState2'),
        
        c: SCUI.State2.design()
        
      })
      
    });
    
    statechart.initStatechart();
  },
  
  teardown: function() {
    statechart.destroy();
    externalState1 = null;
    externalState2 = null;
  }
});

test("check statechart states", function() {
  var stateA = statechart.getState('a'),
      stateB = statechart.getState('b'),
      stateC = statechart.getState('c'),
      stateD = statechart.getState('d'),
      stateE = statechart.getState('e');

  equals(SC.kindOf(stateA, externalState1), true, 'state a should be kind of externalState1');
  equals(SC.kindOf(stateB, externalState2), true, 'state b should be kind of externalState2');
  equals(SC.kindOf(stateE, externalState1), true, 'state e should be kind of externalState1');
  equals(SC.kindOf(stateC, externalState1), false, 'state c should not be kind of externalState1');
  equals(SC.kindOf(stateD, externalState1), false, 'state d should not be kind of externalState1');
  
  equals(stateA !== stateE, true, 'state a should not be equal to state e');
});

test("check statechart initialization", function() {
  var monitor = statechart.get('monitor');
  var root = statechart.get('rootState');
  
  equals(monitor.get('length'), 2, 'initial state sequence should be of length 2');
  equals(monitor.matchSequence().begin().entered(root, 'a').end(), true, 'initial sequence should be entered[ROOT, a]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('a'), true, 'current state should be a');
});

test("go to state e", function() {
  var monitor = statechart.get('monitor');
      
  monitor.reset();
  statechart.gotoState('e');
  
  equals(monitor.get('length'), 3, 'initial state sequence should be of length 3');
  equals(monitor.matchSequence().begin().exited('a').entered('b', 'e').end(), true, 'initial sequence should be exited[a], entered[b, e]');
  equals(statechart.get('currentStateCount'), 1, 'current state count should be 1');
  equals(statechart.stateIsCurrentState('e'), true, 'current state should be e');
});