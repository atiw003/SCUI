// ==========================================================================
// SCUI.TimeSelectorFieldView Unit Test
// ==========================================================================
/**
  @author Brandon Blatnick
*/

var pane = SC.ControlTestPane.design()
  .add("basic", SCUI.TimeSelectorFieldView, { 

  });
  
pane.show(); // add a test to show the test pane

module('SCUI.TimeSelectorFieldView ui');

test("Check that all wizard steps are visible", function() {
  ok(pane.view('basic').get('isVisibleInWindow'), 'basic.isVisibleInWindow should be YES');
});

