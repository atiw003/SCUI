// ==========================================================================
// SCUI.State Unit Test
// ==========================================================================
/*globals SCUI */

/**
  @author Michael
*/
statechart = null;

// ..........................................................
// CONTENT CHANGING
// 

module("SCUI.Statechart Mixin: Basic Unit test", {
  setup: function() {
    
    statechart = SCUI.Statechart2.create({
      
      trace: YES,
      
      rootState: SCUI.State2.design({
        
        initialSubstate: 'stateA',

        stateA: SCUI.State2.design({
          
          substatesAreParallel: YES,

          stateC: SCUI.State2.design(),
          
          stateD: SCUI.State2.design()

        }),

        stateB: SCUI.State2.design({
          
          substatesAreParallel: YES,
          
          stateE: SCUI.State2.design(),
          
          stateF: SCUI.State2.design()
          
        })
      })
      
    });
    
    statechart.initStatechart();
  },
  
  teardown: function() {
  //   basic1.destroy();
  //   basic2.destroy();
  }
});

test("statechart1 states check", function() {
  // var root = statechart1.get('rootState');
  // equals(root.get('isRootState'), true, 'root state should have isRootState == true');
  // equals(root.get('isCurrentState'), true, 'root state should have isCurrentState == true');
  // equals(root.get('substates').length, 0, 'root state should have no substates');
  // 
  // statechart2.gotoState('stateB');
  // statechart2.gotoState('stateA');
});