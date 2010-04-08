// ========================================================================
// SCUI.ColorPicker Tests
// ========================================================================

var pane = SC.ControlTestPane.design()
  .add('menu', SCUI.ColorPickerPreviewView, {
    layout: {width:100, height:20}
  });
  
pane.show();
window.pane = pane;

module("ColorPicker View Tests", pane.standardSetup({
}));

test("Widget has a widget container", function() {
  var childView, position;
  var view = pane.view('menu');

  childView = view.childViews[0];
  ok(childView.get('isVisible') === YES, "Child view is visible");

});

