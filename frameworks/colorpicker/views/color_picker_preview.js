// ==========================================================================
// SCUI.ColorPickerPreviewView
// ==========================================================================

/*globals Color*/
/** @class

  This is the color picker preview view

  @extends SC.View
  @author Cristian Bodnar
*/

SCUI.ColorPickerPreviewView = SC.WellView.extend({
  bgColorBinding: 'SCUI.colorsController.selectedColor',
  displayProperties: 'bgColor'.w(),
  layout: {width:100, height:20},
  
  render: function(){
    var color;
    var sel = this.get('bgColor');
    if(!sel){
      color = 'FFFFFF';
    }
    else{
      color = sel;
    }
    this.$().css('background-color','#'+color);
  },
  
  mouseDown: function(evt){
    var pane = SCUI.ColorPickerPane.create({
      layout: {width:400, height: 600, top: this.$().offset().top+25}
    });
    if(pane) pane.append();
    
  }
});