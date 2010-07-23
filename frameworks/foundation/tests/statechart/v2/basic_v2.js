// ==========================================================================
// SCUI.State Unit Test
// ==========================================================================
/*globals SCUI */

/**
  @author Michael
*/
statechart1 = null;
statechart2 = null;

// ..........................................................
// CONTENT CHANGING
// 

module("SCUI.Statechart Mixin: Basic Unit test", {
  setup: function() {
    
    statechart1 = SCUI.Statechart2.create({
      
      trace: YES,
      
      rootState: SCUI.State2.design({
        
        lastInvoked: '',
    
        foo: function() {
          this.set('lastInvoked', 'foo');
        },
    
        bar: function() {
          this.set('lastInvoked', 'bar');
        }
      })
      
    });
    
    statechart2 = SCUI.Statechart2.create({
      
      trace: YES,
      
      rootState: SCUI.State2.design({
        
        initialSubstate: 'stateA',
    
        stateA: SCUI.State2.design({
          
          initialSubstate: 'stateC',
    
          stateC: SCUI.State2.design(),
          
          stateD: SCUI.State2.design()
    
        }),
    
        stateB: SCUI.State2.design({
          
          initialSubstate: 'stateE',
          
          stateE: SCUI.State2.design(),
          
          stateF: SCUI.State2.design()
          
        })
      })
      
    });
    
    statechart1.initStatechart();
    statechart2.initStatechart();
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

// test("statechart2 states check", function() {
//   var root = statechart1.get('rootState');
//   var stateA = statechart1.getState('stateA')
//   equals(root.get('isRootState'), true, 'root state should have isRootState == true');
//   equals(root.get('isCurrentState'), true, 'root state should have isCurrentState == true');
//   equals(root.get('substates').length, 0, 'root state should have no substates');
// })

// 
// test("basic2 state transition", function() {
//   basic2.initializeState();
// 
//   equals(basic2.get('currentState'), basic2.get('stateA'), "stateA should be current state");
//   equals(basic2.getPath('stateA.currentState'), basic2.get('stateA'), "stateA should be current state");
//   equals(basic2.getPath('stateA.isCurrentState'), true, "stateA should be current state");
//   equals(basic2.getPath('stateB.currentState'), basic2.get('stateA'), "stateA should be current state");
//   equals(basic2.getPath('stateB.isCurrentState'), false, "stateA should be current state");
// 
//   basic2.sendEvent('foo');
//   
//   equals(basic2.get('currentState'), basic2.get('stateB'), "stateB should be current state");
//   equals(basic2.getPath('stateA.currentState'), basic2.get('stateB'), "stateA should be current state");
//   equals(basic2.getPath('stateA.isCurrentState'), false, "stateB should be current state");
//   equals(basic2.getPath('stateB.currentState'), basic2.get('stateB'), "stateA should be current state");
//   equals(basic2.getPath('stateB.isCurrentState'), true, "stateB should be current state");
//   
//   basic2.sendEvent('bar');
// 
//   equals(basic2.get('currentState'), basic2.get('stateA'), "stateA should be current state");
//   equals(basic2.getPath('stateA.currentState'), basic2.get('stateA'), "stateA should be current state");
//   equals(basic2.getPath('stateA.isCurrentState'), true, "stateA should be current state");
//   equals(basic2.getPath('stateB.currentState'), basic2.get('stateA'), "stateA should be current state");
//   equals(basic2.getPath('stateB.isCurrentState'), false, "stateA should be current state");
// });
