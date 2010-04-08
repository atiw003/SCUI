// ==========================================================================
// SCUI.ColorPickerWheelView
// ==========================================================================

/*globals Color*/
/** @class

  This is the color picker view

  @extends SC.View
  @author Cristian BOdnar
  @version 0.1
  @since 0.1
*/

SCUI.ColorPickerWheelView = SC.View.extend({  
  isVisible: YES,
  layout: {left: 2, top:85},
  
  createChildViews: function(){
      var childViews = [], view;

      view = this.createChildView(SC.View.design({
        classNames:['wheel'],
        layout:{width: 373, height:373}
      }));
      childViews.push(view);
    
      view = this.createChildView(SC.View.design({
        classNames:['wheel-black'],
        layout:{width: 373, height:373},
        opacityBinding: this.get('opacityPath'),
        
        displayProperties: 'opacity'.w(),
        init:function(){
          sc_super();
          this._setWheelProperties();

          var HSV = SC.Object.create({
            hue: 0,
            saturation: 0,
            value: 255 
          });
          
          var RGB = SCUI.colorsController.HSVtoRGB(HSV);
          
          SCUI.colorsController.set('currentHSV', HSV);
          SCUI.colorsController.set('currentRGB', RGB);
        },
        
        render: function(){
          var opacity = this.get('opacity');
          if(opacity || opacity === 0){
            opacity = 1 - opacity/255;
          }
          else{
            opacity = 0;
          }
          this.$().css('opacity',opacity);
        },
        
        mouseDown: function(evt){
          var mousePoint = SC.Object.create({
            x: evt.clientX - this.$().offset().left,
            y: evt.clientY - this.$().offset().top
          });
          
          SCUI.colorsController.set('mousePoint',mousePoint);
          SCUI.colorsController.getColor();
          return YES;
        },
        
        _setWheelProperties: function(){
          //get radius
          var radius = Math.min(this.get('frame').width, this.get('frame').height)/2;
          
          //get the center of the circle point
          var center = SC.Object.create({
            x: radius,
            y: radius
          });
         
          SCUI.colorsController.set('centerPoint', center);
          SCUI.colorsController.set('radius', radius);
        }
      }));
      childViews.push(view);
    
    view = this.createChildView(SC.View.design({
      layout:{left: 9, top: 412, width:358, height:20},
      classNames: ['degradee'],
      bgColorBinding: this.get('selectedColorPath'),
      displayProperties: 'bgColor'.w(),
      render: function(context, firstTime){
        var color;
        var sel = this.get('bgColor');
        if(!sel){
          color = 'FFFFFF';
        }
        else{
          color = sel;
        }
        this.$().css('background-color','#'+color);     
      }
    }));
    childViews.push(view);
    
    view = this.createChildView(SC.SliderView.design({
      layout:{top: 420, width: 373},
      maximum: 255,
      minimum: 0,
      step: 1,
      valueBinding: this.get('opacityPath')
    }));
    childViews.push(view);
    
    this.set('childViews', childViews);
  }
});