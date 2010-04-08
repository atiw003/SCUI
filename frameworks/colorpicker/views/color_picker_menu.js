sc_require('views/color_picker_wheel');
sc_require('views/color_picker_sliders');
// ==========================================================================
// SCUI.ColorPickerMenuView
// ==========================================================================

/*globals Color*/
/** @class

  This is the color picker view

  @extends SC.View
  @author Cristian Bodnar
*/

SCUI.CompositePickerView = SC.View.design({
  layout: {top:0, width: 400},
  childViews: 'menuView wheelView slidersView'.w(),
  bgColorPath: 'SCUI.colorsController.selectedColor',
  valuePath: 'SCUI.colorsController.selectedColor',
  
  menuView: SC.View.design({
    layout: {top:0, left:10, width: 373, height: 75},
    createChildViews:function(){
      var that = this;
      var childViews = [], view;
      
      view = this.createChildView(SC.View.design({
        layout: {top:0, left:150, width:32, height: 32},
        classNames:['wheel-menu'],
        mouseDown: function(evt){
          that.getPath('parentView.wheelView').set('isVisible', YES);
          that.getPath('parentView.slidersView').set('isVisible', NO);
        }
      }));
      childViews.push(view);
      
      view = this.createChildView(SC.View.design({
        layout: {top:0, left:210, width:32, height: 32},
        classNames:['sliders-menu'],
        mouseDown: function(evt){
          that.getPath('parentView.wheelView').set('isVisible', NO);
          that.getPath('parentView.slidersView').set('isVisible', YES);
        }
      }));
      childViews.push(view);
      
      view = this.createChildView(SC.LabelView.design({
        layout: {left: 50, top: 45, width: 50, height: 20},
        value: '_Preview'.loc()
      }));
      childViews.push(view);
      
      view = this.createChildView(SCUI.ColorPickerPreviewView.design({
        layout:{left: 110, top: 45,width:100, height:20},
        bgColorBinding: this.getPath('parentView.bgColorPath')
      }));
      childViews.push(view);
      
      view = this.createChildView(SC.TextFieldView.design({
        layout: {left: 220, top:45, width: 50, height: 20},
        valueBinding: this.getPath('parentView.valuePath')
      }));
      childViews.push(view);
      
      this.set('childViews', childViews);
    }
  }),
  
  wheelView: SCUI.ColorPickerWheelView.design({
    opacityPath: 'SCUI.colorsController.value',
    currentRGBPath: 'SCUI.colorsController.currentRGB',
    currentHSVPath: 'SCUI.colorsController.currentHSV',
    selectedColorPath: 'SCUI.colorsController.selectedColor'
  }),
  
  slidersView: SCUI.ColorPickerSlidersView.design({
    redPath: 'SCUI.colorsController.red',
    greenPath: 'SCUI.colorsController.green',
    bluePath: 'SCUI.colorsController.blue',
    displayRedPath: 'SCUI.colorsController.displayRed',
    displayGreenPath: 'SCUI.colorsController.displayGreen',
    displayBluePath: 'SCUI.colorsController.displayBlue',
    huePath: 'SCUI.colorsController.hue',
    saturationPath: 'SCUI.colorsController.saturation',
    valuePath: 'SCUI.colorsController.value',
    displayHuePath: 'SCUI.colorsController.displayHue',
    displaySaturationPath: 'SCUI.colorsController.displaySaturation',
    displayValuePath: 'SCUI.colorsController.displayValue'
  })
});