// ==========================================================================
// SCUI.State Unit Test
// ==========================================================================
/*globals SCUI */

/**
  @author Michael
*/
statechart = null;
externalState1 = null;
externalState2 = null;

// ..........................................................
// CONTENT CHANGING
// 

module("SCUI.Statechart Mixin: Basic Unit test", {
  setup: function() {
    
    externalState1 = SCUI.State2.extend({
      
      foo: 'hello'
      
    });
    
    externalState2 = SCUI.State2.extend({
      
      initialSubstate: 'stateShit',
      
      stateD: SCUI.State2.design({
        
      }),
      
      stateE: SCUI.State2.plugin(externalState1)
      
    });
    
    statechart = SC.Object.create(SCUI.Statechart2, {
      
      rootState: SCUI.State2.design({
        
        initialSubstate: 'stateA',
        
        stateA: SCUI.State2.plugin('externalState1'),
        
        stateB: SCUI.State2.plugin('externalState2'),
        
        stateC: SCUI.State2.design({
          
        })
        
      })
      
    });
    
    statechart.initialize();
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