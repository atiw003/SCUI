//============================================================================
// SCUI.MultiSliderView
//============================================================================
/*globals SCUI*/

/** @class

 MultiSliderView
 
 
 
 Example:
 
 SCUI.MultiSliderView.extend({
  layout: {width: 400,height: 80,top: 50, centerX: 0},
  bindControls: YES,
  enableAreas: YES,
  areaMargin: [20,20],
  controls: [
    {
      control: {
        position: 0.5,
        width: 30,
        height: 30,
        align: 0.5,
        label: 'A'
      },
      area: {
        label: 'A\'s Area',
        backgroundColor: 'rgba(0,0,0,.5)'
      }
    },
    {
      control: {
        position: 0.5,
        width: 30,
        height: 30,
        align: 0.5,
        label: 'A'
      },
      area: {
        label: 'A\'s Area',
        backgroundColor: 'rgba(0,0,0,.5)'
      }
    }
  ]
 });
 
 
 @extends SC.View, SC.Label, SC.Control, SC.Mobility
 @author Jason Dooley
 @version current version
 @since in what version was this class born

*/

SCUI.MultiSliderView = SC.View.extend(SC.Control,
 /** @scope SCUI.MultiSlider.prototype */{
  type: 'SCUI.MultiSliderView',
  
  classNames: 'scui-multi-slider'.w(),
  
  // [TODO]
  step: 0.1,
  
  selectedControl: null,
  
  /**
    The individual slider attributes
  */
  controls: null,
  
  /**
    If you want the controls to bind to eachother so that no slider
    can pass another slider.
  */
  bindControls: NO,
  
  /**
    Displays areas between the controls where you can put the label and colors
  */
  enableAreas: NO,
  
  /**
    This puts space between the [top,bottom](horizontal) or [left,right](vertical)
    of the view depending on orientation.
  */
  areaMargin: [0,0],
  
  /**
    Ease of access property that will fill .set('content',this) on your controller
    Ease methods are:
    .selection - gives you the object that was mouseDown on (area or control)
    .areas - array of the areas
    .controls - array of the controls
  */
  outletController: null,
  
  /**
    This is sort of more for show. It will be autocalculated based upon
    dimensions of your area.
  */
  isHorizontal: function () {
    var w = this.get('frame').width, h = this.get('frame').height;
    return w >= h;
  }.property('frame').cacheable(),
  
  /**
    Calculate the maximum of the view based on orientation
  */
  maximum: function () {
    var f = this.get('frame');
    return this.get('isHorizontal') ? f.width : f.height;
  }.property('isHorizontal').cacheable(),
  
  /**
    Set when you do something with a control or an area
  */
  selection: null,
  
  /**
    Hands over a safe value from 
  */
  safePosition: function (val) {
    if (SC.typeOf(val) === SC.T_NUMBER) {
      var max = this.get('maximum');
      if ( val <=1 && val >=0 ){
        val = max*val;
      } else {
        if (val < 0) { val = -1*val; }
      }
      return val;
    }
    return NO;
  },
  
  /**
    Insert all the controls and areas (if allowed)
  */
  createChildViews: function () {
    var controls = this.get('controls');
    
    if( controls ) {
      var parent = this.get('frame'), childControls = [], childAreas = [],childViews = [],
        doBind = this.get('bindControls'), areasEnabled = this.get('enableAreas'), 
        max = this.get('maximum'), isHorizontal = this.get('isHorizontal'), view,
        bindController = this.get('bindController'), areaMargin = this.get('areaMargin');
      var offset = this.get('offest');
      
      var length = controls.length;
      
      // switch controls to objects
      for (var i=0;i<length;i++) {
        if (SC.typeOf(controls[i]) === SC.T_HASH) controls[i] = SC.Object.create(controls[i]);
      }
      
      // if there's only one, just add it without all the hassle
      if (length === 1) {
        
        var control = controls[0];var v;
        if ( v = this.safePosition(control) ) {
          control = {position: v};
        } else {
          control = controls[0].get('control');
        }
        
        control.maximum = max;
        control.bindController = bindController;
        view = this.createChildView( SCUI.MultiSliderView.Control.extend( control ) );
        childControls.push( view );
        
      } else {
        
        controls = controls.sort(function (a,b) {
          return a.get('control').position - b.get('control').position;
        });
        
        for(i=0;i<length;i++) {
          var enable;
          
          if ( !doBind ) {
            // if no control bindings, add the control
            // means we skip areas completely
            enable = YES;
          } else {
            if (areasEnabled) {
              var a = controls[i].get('area');
              if (!a) { a = {}; }
              a.isHorizontal = isHorizontal;
              a.margin = areaMargin;
              a.bindController = bindController;
              // insert the area
              view = this.createChildView( SCUI.MultiSliderView.Area.extend( a ) );
              childAreas.push(view);
              
              /**
                disable the control for this area since its max boundry is the
                max of the slider
              */
              enable = (i+1!==length);
            }
          }
          
          if ( enable ) {
            // last minute touches before the big night out
            v = controls[i];
            if (v = this.safePosition(v)) {
              control = SC.Object.create({position: v, maximum: max});
            } else {
              control = controls[i].control;
            }
            
            if (offset) { control.boundryOffest = offset; }
            control.isHorizontal = isHorizontal;
            control.isBound = YES;
            control.bindController = bindController;

            if(areasEnabled && doBind) { control.enableArea = YES; }
            view = this.createChildView( SCUI.MultiSliderView.Control.extend( control ) );
            childControls.push(view);
            
          }
        }
      }
      
      // faux outlet to access the collection of controls and areas easier
      this.set('areas',childAreas);
      this.set('controls',childControls);
      
      // for layering reasons , I want to put the areas down first
      childViews = childAreas.concat(childControls);
      this.set('childViews',childViews);
    }
  },
  
  /**
    Need to map controls (and areas) to each other for boundry limitations
    after we insert them into the view.
    
    Since they are originally placed as objects without a care in the world,
    we have to lock them down to the reality that they're never going to escape
    the harsh truth that they'll be forced to listen to Barbara Streisand forever.
    
    ...as long as we care. @bindSliders:NO will just allow the controls to slip
    past one another. Unbound controls can not have areas.
  */
  init: function () {
    sc_super();
    var out = this.get('outletController');
    if (out) { out.set('content',this); }
    
    if (this.get('bindControls')) {
      var childViews = this.get('childViews');
      var length = childViews.length;
      var controls;
      
      if (this.get('enableAreas')) {
        var split = (length%2 !== 0) ? Math.ceil(length/2) : (length/2 + 1);
        var areas = childViews.slice(0,split);
        controls = childViews.slice(split);
      } else {
        controls = childViews;
      }
      
      childViews = null; // cleanup?
      
      var controlsLength = controls.length;
      var hasAreas = areas ? true : false;
      if (controlsLength > 1) {
        for (var i=0;i<controlsLength;i++) {
          if (i>0) { controls[i].set('boundryMinimum', controls[i-1] ); }
          if (i+1 !== controlsLength ) { controls[i].set('boundryMaximum', controls[i+1] ); }
          if (hasAreas) {
            controls[i].set('minimumArea',areas[i]);
            controls[i].set('maximumArea',areas[i+1]);
          }
        }
      }
      
      if (areas) {
        var areasLength = areas.length;
        for (i=0;i<areasLength;i++) {
          areas[i].set('maximum',controls[i]);
          if (controls[i-1]) areas[i].set('minimum',controls[i-1]);
          areas[i].updateLayout();
        }
      }
    }
  }
});

//============================================================================
// SCUI.MultiSliderView.Control
//============================================================================


SCUI.MultiSliderView.Control = SC.LabelView.extend(SCUI.Mobility,{
  type: 'SCUI.MultiSliderView.Control',
  
  classNames: 'scui-multi-slider-control'.w(),
  
  textAlign: SC.ALIGN_CENTER,
  
  /**
    Defines where the control is in the view
    
    returns {@Number}
  */
  position: 0,
  
  // default width and height
  width: 20,
  height: 20,
  
  /**
    Locks the slider in place if enabled.
  */
  isLocked: NO,
  
  /**
    Let the control know there are areas without having to check
    if the objects actually exist. 
  */
  enableArea: NO,
  
  isHorizontal: YES,
  
  enableValue: YES,
  
  /**
    boundryM*
    
    returns {@Object}
  */
  boundryMaximum: null,
  boundryMinimum: null,
  
  boundryOffset: null,
  
  minimumArea: null,
  
  maximumArea: null,
  
  maximum: null,
  
  minimum: 0,
  
  isBound: NO,
  
  /**
    Defines the boundries/dimensions of the view based on minimum and maximum,
    boundryMinimum and boundryMaximum
    
    returns {@Hash} *.min and *.max
  */
  bounds: function () {
    var max = this.get('maximum'), min = this.get('minimum');
    var isHorizontal = this.get('isHorizontal');
    var bounds = {};
    var offset = this.get('offset');
    
    if ( this.get('isBound') ) {
      var boundMax = this.getPath('boundryMaximum.position');
      var boundMin = this.getPath('boundryMinimum.position');

      // minimum  bound
      if (!boundMin) { boundMin = min; }
      if (!isHorizontal) { boundMin = max - boundMin; }

      // maximum bound
      if (!boundMax) { boundMax = max; }
      
      /**
        have to reverse the bounds for vertical charts due to the left->right
        versus top to bottom paradigm if we want the 'top' to be the maximum
        value
      */
      bounds = {
        min: isHorizontal ? boundMin : max - boundMax,
        max: isHorizontal ? boundMax : boundMin
      };
    } else {
      // free range controls just set to parent min=0 and width/height
      bounds['min'] = boundMin;
      bounds['max'] = boundMax;
    }

    return bounds;
  }.property('boundryMinimum','boundryMaximum').cacheable(),
  
  // cache the parent
  parent: function () {
    return this.get('parentView');
  }.cacheable().property(),
  
  /**
    Calculate the offset 
    returns {@Number}
  */
  offset: function () {
    var ret = 0;
    var boundryOff = this.get('boundryOffset');    
    if ( boundryOff ) {
      ret = boundryOff;
    } else {
      ret = (this.get('isHorizontal') ? this.get('width') : this.get('height')) / 2;
    }
    return ret;
  }.property('width','height').cacheable(),
  
  /**
    offsetSelf
    
    Calculate the position of the middle of the control and return.
    
    returns {@Number}
  */
  offsetSelf: function () {
    var offset = this.get('offset'), selfFrame = this.get('frame');
    return offset + (this.get('isHorizontal') ? selfFrame.x : selfFrame.y);
  }.property('frame'),
  
  /**
    canMove is what allows the control to slide within its boundries
    Lock it if it hits them, but then check the mouse position to unlock.
  */
  _canMove: function (evt) {
    if (this.get('isLocked')) return NO;
    var canMove;
    var isHorizontal = this.get('isHorizontal');
    var parentFrame = this.getPath('parent.frame');
    var mousePosition = isHorizontal ? evt.pageX - parentFrame.x : evt.pageY - parentFrame.y;
    var offset = this.get('offset');
    var offsetSelf = this.get('offsetSelf');
    var bounds = this.get('bounds');
    
    // Check for inside local boundries
    if (
      offsetSelf > bounds.min
      && offsetSelf < bounds.max
    ) { canMove = YES; }
    else {
      // Ok, I can't move... wait for conditions when I can
      if (offsetSelf === bounds.min) {
        canMove = mousePosition >= bounds.min;
      }
      if (offsetSelf === bounds.max) {
        canMove = mousePosition <= bounds.max;
      }
    }
    
    return canMove;
  },
  
  /**
    Time to dynamically set some dimensions and defaults relative to MultiSlider
  */
  init: function () {
    sc_super();

    var position = this.get('position'), offset = this.get('offset'), isHorizontal = this.get('isHorizontal'),
      parentD = this.getPath('parent.frame'), align = this.get('align');
    
    // define the maximum of value of the entire View
    var max = this.get('maximum');
    if (!max) {
      max = isHorizontal ? parentD.width : parentD.height;
      this.set('maximum', max);
    }
    
    // if the position is a percentage, convert it to an integer and set
    if (position <= 1 && position >= 0) {
      position = Math.round(max * (position));
      this.set('position',position);
    }
    
    // define dimensions
    var layout = {
      width: this.get('width'),
      height: this.get('height')
    };
    
    // position the control
    var pM = isHorizontal ? parentD.height : parentD.width;
    if (isHorizontal) {
      layout.left = position-offset;
      if ( align <= 1 && align >= 0 ) {
        if (align > 0.5) { layout.bottom = pM - (pM * align); }
        else if ( align === 0.5 ) { layout.centerY = 0; }
        else { layout.top = pM * align; }
      } else {
        if (!align) {
          layout.centerY = 0;
        } else {
          if (align === 'top') layout.top = 0;
          if (align === 'bottom') layout.bottom = 0;
        }
      }
    } else {
      layout.bottom = position-offset;
      if ( align <= 1 && align >= 0 ) {
        if (align > 0.5) { layout.right = pM - (pM * align); }
        else if ( align === 0.5 ) { layout.centerX = 0; }
        else { layout.left = pM * align; }
      } else {
        if (!align) {
          layout.centerX = 0;
        } else {
          if (align === 'left') layout.left = 0;
          if (align === 'right') layout.right = 0;
        }
      }
    }
    
    // update the layout
    this.set('layout',layout);
    
    // update the label
    this.set('value',this.get('label'));
  },
  /**
    @private
  */
  _prevDelta: null,
  _position: null,
  
  _validDelta: function () {
    var bounds = this.get('bounds'), delta = this._prevDelta, pos = this._position;
    var ret = ((delta > 0) ? bounds.max : bounds.min) - pos;
    return ret;
  },

  /** 
    Need to overwrite mouseDragged so that I can limit the range of movement.
    Only care about 1 axis at a time.
  */  
  mouseDragged: function(evt) {
    if (this.get('isLocked')) return NO;
    var i = this._mouseDownInfo ;
    
    if(i){
      var view = this.get('viewThatMoves') || this;
      var isHorizontal = this.get('isHorizontal');
      var offsetSelf = this.get('offsetSelf'), max = this.get('maximum');
      var delta = isHorizontal ? evt.pageX - i.pageX : evt.pageY - i.pageY;
      var enableValue = this.get('enableValue');
      
      if (!isHorizontal) { offsetSelf = max - offsetSelf; } // fix ascension
      
      // make sure we haven't hit boundries and update values
      if ( this._canMove(evt) ) {
        if (enableValue) { this.set('value',offsetSelf); }
        this._prevDelta = delta;
        this.set('position',offsetSelf);
      } else {
        // if we can't move, find a good position and put the object there
        delta = this._validDelta();
        if (enableValue) { this.set('value',offsetSelf); }
      }
      
      // if there are areas, let them know
      if (this.get('enableArea')) {
        var minA = this.get('minimumArea'), maxA = this.get('maximumArea');
        
        minA.updateMovement();
        maxA.updateMovement();
      }
      
      this._adjustLayout(delta);
    }
    
    return NO;
  },
  
  /**
    Adding on the ability to see the value when you mouseDown on the slider
  */
  mouseDown: function (evt) {
    sc_super();
    this.notifyPropertyChange('bounds');
    var parent = this.get('parent');

    parent.set('selection',this);
    var offsetSelf = this.get('offsetSelf');    
    if (offsetSelf) {
      this._position = offsetSelf;
      if (!this.get('isHorizontal')) { offsetSelf = this.get('maximum') - offsetSelf; }
      if (this.get('enableValue')) {this.set('value',offsetSelf);}
    }
    var bounds = this.get('bounds');
  },
  
  /**
    Reset the value of the slider to the correct label and refresh the areas.
    Also ensures the control is in the correct position.
  */
  mouseUp: function (evt) {    
    this.set('value', this.get('label') );

    if (!this._canMove(evt) && !this.get('isLocked')) {
      var delta = this._validDelta();
      this._adjustLayout(delta);  
      this._position = this.get('offsetSelf');
    }
    
    // if there are areas, let them know
    if (this.get('enableArea')) {
      var minA = this.get('minimumArea'), maxA = this.get('maximumArea');
      
      minA.updateMovement();
      maxA.updateMovement();
    }
    
  },
  
  /**
    Private function ripped from SCUI.Mobility to adjust the view properly
  */
  _adjustLayout: function (delta) {
    var i = this._mouseDownInfo;
    var view = this.get('viewThatMoves') || this;
    if ( this.get('isHorizontal') ) {
      this._adjustViewLayoutOnDrag(view, i.zoneX, i.zoneY, delta, i, 'left', 'right', 'centerX', 'width');
    } else {
      this._adjustViewLayoutOnDrag(view, i.zoneY, i.zoneX, delta, i, 'top', 'bottom', 'centerY', 'height');
    }
  }
});

//============================================================================
// SCUI.MultiSliderView.Area
//============================================================================

SCUI.MultiSliderView.Area = SC.View.extend(SCUI.Mobility,SC.Control,{
  type: 'SCUI.MultiSliderView.Area',
  
  classNames: 'scui-multi-slider-area'.w(),
  
  backgroundColor: 'rgba(255,255,255,.5)',
  
  isHorizontal: YES,
  
  // [TODO]
  isMobile: YES,
  
  /**
    @minimum and @maximum will be the controls or null to define boundries
    
    returns {@SCUI.MultiSliderView.Control} OR null
  */
  maximum: null,
  minimum: null,
  
  margin: [0,0],
  
  // [TODO] Text color
  textColor: '#ffffff',
  
  layout: {top: 0,left: 0},
  
  // cache the parentView
  parent: function () {
    return this.get('parentView');
  }.cacheable(),
  
  /**
    Defines the boundries/dimensions of the view based on minimum and maximum
    returns {@Hash} *.min and *.max
  */
  bounds: function () {
    var bounds = {};
    var isH = this.get('isHorizontal');
    var parent = this.getPath('parent.frame');
    var min = this.get('minimum'), max = this.get('maximum');

    if (!min) { min = 0; }
    else { min = min.get('position'); }
    
    if (!max) { max = isH ? parent.width : parent.height ; }
    else { max = max.get('position'); }
    
    bounds.min = min;
    bounds.max = max;
    
    return bounds;
  }.property('maximum','minimum').cacheable(),
  
  /**
    Add onto layout so I can redefine the view as the control moves
  */
  updateLayout: function () {
    sc_super();
    var isH = this.get('isHorizontal');
    var parentD = this.getPath('parent.frame');
    var max = isH ? parentD.width : parentD.height;
    var bounds = this.get('bounds');
    var margin = this.get('margin');
    var layout = {};

    if (isH) {
      layout['top'] = margin[0];
      layout['bottom'] = margin[1];
      layout['left'] = bounds.min;
      layout['right'] = max - bounds.max;
    } else {
      layout['left'] = margin[0];
      layout['right'] = margin[1];
      layout['bottom'] = bounds.min;
      layout['top'] = max - bounds.max;
    }
    
    
    this.set('layout',layout);
  },
  
  /**
    Tell the area to invalidate the bounds and initiate an update
  */
  updateMovement: function () {
    this.notifyPropertyChange('bounds');
    this.updateLayout();
  },
  
  
  /**
    Setup the inner view for the lable
    
    [TODO] look for exampleView
  */
  createChildViews: function () {
    var isHorizontal = this.get('isHorizontal');
    var label = this.get('label'), color = this.get('color');
    var view = this.createChildView( SC.LabelView.extend({
      layout: {left: 0,right: 0,top: 0,bottom: 0},
      textAlign: SC.ALIGN_CENTER,
      value: label
    }) );
    
    this.set('childViews',[view]);
  },
  
  // Tell SCUI.MultiSliderView that you are selected
  mouseDown: function (evt) {
    sc_super();
    this.get('parent').set('selection',this);
  },
  
  mouseDragged: function (evt) {
    sc_super();
  }
});