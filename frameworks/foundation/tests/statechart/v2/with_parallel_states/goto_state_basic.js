// ==========================================================================
// SCUI.State Unit Test
// ==========================================================================
/*globals SCUI */

/**
  @author Michael
*/
var statechart = null;

// ..........................................................
// CONTENT CHANGING
// 

module("SCUI.Statechart: With Parallel States - Goto State Basic Tests", {
  setup: function() {
    
    statechart = SCUI.Statechart2.create({
      
      monitorIsActive: YES,
      
      rootState: SCUI.State2.design({
        
        substatesAreParallel: YES,

        a: SCUI.State2.design({
          initialSubstate: 'c',
          c: SCUI.State2.design(),
          d: SCUI.State2.design()
        }),

        b: SCUI.State2.design({
          initialSubstate: 'e',
          e: SCUI.State2.design(),
          f: SCUI.State2.design()
        })
      })
      
    });
    
    statechart.initStatechart();
  },
  
  teardown: function() {
    statechart.destroy();
  }
});

test("check statechart initialization", function() {
  var monitor = statechart.get('monitor'),
      root = statechart.get('rootState'), 
      stateA = statechart.getState('a'),
      stateB = statechart.getState('b');
  
  equals(monitor.get('length'), 5, 'initial state sequence should be of length 5');
  equals(monitor.matchSequence().begin().entered(root, 'a', 'c', 'b', 'e').end(), true, 'initial sequence should be entered[ROOT, a, c, b, e]');
  equals(monitor.matchSequence().begin().entered(root, 'a', 'b', 'c', 'e').end(), false, 'initial sequence should not be entered[ROOT, a, b, c, e]');
  equals(statechart.get('currentStateCount'), 2, 'current state count should be 2');
  equals(statechart.stateIsCurrentState('c'), true, 'current state should be c');
  equals(statechart.stateIsCurrentState('e'), true, 'current state should be e');
  equals(stateA.stateIsCurrentSubstate('c'), true, 'state a\'s current substate should be state c');
  equals(stateA.stateIsCurrentSubstate('d'), false, 'state a\'s current substate should not be state d');
  equals(stateB.stateIsCurrentSubstate('e'), true, 'state a\'s current substate should be state e');
  equals(stateB.stateIsCurrentSubstate('f'), false, 'state a\'s current substate should not be state f');
});

test("from state c, go to state d, and from state e, go to state f", function() {
  var monitor = statechart.get('monitor'),
      stateA = statechart.getState('a'),
      stateB = statechart.getState('b'),
      stateC = statechart.getState('c'),
      stateE = statechart.getState('e');
      
  monitor.reset();
  
  stateC.gotoState('d');
  equals(monitor.get('length'), 2, 'state sequence should be of length 2');
  equals(monitor.matchSequence().begin().exited('c').entered('d').end(), true, 'sequence should be exited[c], enterd[d]');
  
  monitor.reset();
  
  stateC.gotoState('f');
  equals(monitor.get('length'), 2, 'state sequence should be of length 2');
  equals(monitor.matchSequence().begin().exited('e').entered('f').end(), true, 'sequence should be exited[e], enterd[f]');
  
  equals(statechart.get('currentStateCount'), 2, 'current state count should be 2');
  equals(statechart.stateIsCurrentState('d'), true, 'current state should be d');
  equals(statechart.stateIsCurrentState('f'), true, 'current state should be f');
  equals(stateA.stateIsCurrentSubstate('c'), false, 'state a\'s current substate should not be state c');
  equals(stateA.stateIsCurrentSubstate('d'), true, 'state a\'s current substate should be state d');
  equals(stateB.stateIsCurrentSubstate('e'), false, 'state b\'s current substate should not be state e');
  equals(stateB.stateIsCurrentSubstate('f'), true, 'state b\'s current substate should be state f');
});

test("from state a, go to sibling parallel state b", function() {
  var monitor = statechart.get('monitor'),
      stateA = statechart.getState('a'),
      stateB = statechart.getState('b');
      
  monitor.reset();
  
  // Expect to get an error to be outputted in the JS console, which is what we want since
  // the pivot state is the root state and it's substates are parallel
  stateA.gotoState('b');
  
  equals(monitor.get('length'), 0, 'state sequence should be of length 0');
  equals(statechart.get('currentStateCount'), 2, 'current state count should be 2');
  equals(statechart.stateIsCurrentState('c'), true, 'current state should be c');
  equals(statechart.stateIsCurrentState('e'), true, 'current state should be e');
  equals(stateA.stateIsCurrentSubstate('c'), true, 'state a\'s current substate should be state c');
  equals(stateA.stateIsCurrentSubstate('d'), false, 'state a\'s current substate should not be state d');
  equals(stateB.stateIsCurrentSubstate('e'), true, 'state a\'s current substate should be state e');
  equals(stateB.stateIsCurrentSubstate('f'), false, 'state a\'s current substate should not be state f');
});