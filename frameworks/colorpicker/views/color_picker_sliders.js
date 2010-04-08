// ==========================================================================
// SCUI.ColorPickerSlidersView
// ==========================================================================

/*globals Color*/
/** @class

  This is the color picker view

  @extends SC.View
  @author Cristian BOdnar
  @version 0.1
  @since 0.1
*/

SCUI.ColorPickerSlidersView = SC.View.extend({
  layout: {left: 2, top:85},
  isVisible: NO,
  
  createChildViews: function(){
    var childViews =[], view = null;
    view = this.createChildView(SC.LabelView.design({
      layout: {left: 50, top:50, width:25},
      value: 'RGB'
    }));
    childViews.push(view);

    view = this.createChildView(SC.LabelView.design({
      layout: {left: 50, top:80, width:10},
      value: 'R'
    }));
    childViews.push(view);
    
    view = this.createChildView(SC.SliderView.design({
      layout: {left: 60, top:80, width:100},
      maximum: 255,
      minimum: 0,
      step: 1,
      valueBinding: this.get('redPath')
    }));
    childViews.push(view);

    view = this.createChildView(SC.TextFieldView.design({
      layout: {left: 170, top:80, width:30, height:20},
       valueBinding: this.get('displayRedPath')
    }));
    childViews.push(view);

    view = this.createChildView(SC.LabelView.design({
      layout: {left: 50, top:100, width:10},
      value: 'G'
    }));

    childViews.push(view);
    view = this.createChildView(SC.SliderView.design({
      layout: {left: 60, top:100, width:100},
      maximum: 255,
      minimum: 0,
      step: 1,
      valueBinding: this.get('greenPath')
    }));
    childViews.push(view);

     view = this.createChildView(SC.TextFieldView.design({
        layout: {left: 170, top:100, width:30, height:20},
        valueBinding: this.get('displayGreenPath')
      }));
      childViews.push(view);

    view = this.createChildView(SC.LabelView.design({
      layout: {left: 50, top:120, width:10},
      value: 'B'
    }));
    childViews.push(view);

    view = this.createChildView(SC.SliderView.design({
      layout: {left: 60, top:120, width:100},
      maximum: 255,
      minimum: 0,
      step: 1,
      valueBinding:this.get('bluePath')
    }));
    childViews.push(view);

     view = this.createChildView(SC.TextFieldView.design({
        layout: {left: 170, top:120, width:30, height:20},
        valueBinding: this.get('displayBluePath')
      }));
      childViews.push(view);

    view = this.createChildView(SC.LabelView.design({
      layout: {left: 50, top:150, width:25},
      value: 'HSB'
    }));
    childViews.push(view);

    view = this.createChildView(SC.LabelView.design({
      layout: {left: 50, top:180, width:10},
      value: 'H'
    }));
    childViews.push(view);

    view = this.createChildView(SC.SliderView.design({
      layout: {left: 60, top:180, width:100},
      maximum: 255,
      minimum: 0,
      step: 1,
      valueBinding: this.get('huePath')
    }));
    childViews.push(view);

     view = this.createChildView(SC.TextFieldView.design({
        layout: {left: 170, top:180, width:30, height:20},
        valueBinding: this.get('displayHuePath')
      }));
      childViews.push(view);

    view = this.createChildView(SC.LabelView.design({
      layout: {left: 50, top:200, width:10},
      value: 'S'
    }));

    childViews.push(view);
    view = this.createChildView(SC.SliderView.design({
      layout: {left: 60, top:200, width:100},
      maximum: 255,
      minimum: 0,
      step: 1,
      valueBinding: this.get('saturationPath')
    }));
    childViews.push(view);

     view = this.createChildView(SC.TextFieldView.design({
        layout: {left: 170, top:200, width:30, height:20},
        valueBinding: this.get('displaySaturationPath')
      }));
      childViews.push(view);

    view = this.createChildView(SC.LabelView.design({
      layout: {left: 50, top:220, width:10},
      value: 'B'
    }));
    childViews.push(view);

    view = this.createChildView(SC.SliderView.design({
      layout: {left: 60, top:220, width:100},
      maximum: 255,
      minimum: 0,
      step: 1,
      valueBinding: this.get('valuePath')
    }));
    childViews.push(view);

     view = this.createChildView(SC.TextFieldView.design({
        layout: {left: 170, top:220, width:30, height:20},
        valueBinding: this.get('displayValuePath')
      }));
      childViews.push(view);
      
      this.set('childViews', childViews);
    }
});