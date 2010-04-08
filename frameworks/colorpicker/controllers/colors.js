// ==========================================================================
// SCUI.colorsController
// ==========================================================================

/** @static

  @extends SC.ObjectController
  @author Cristian Bodnar
*/
SCUI.colorsController = SC.ObjectController.create({
  centerPoint: null,
  mousePoint: null,
  radius: null,
  selectedColor: 'FFFFFF',
  selectedBrigthness: 255,
  currentRGB: null,
  currentHSV:null,
  actionChange: null,

  red: 255,
  displayRed: function(key, value){
    if(value !== undefined){
      this.set('red',value);
    }else{
      return Math.round(this.get('red'));
    }
  }.property('red').cacheable(),
  
  green: 255,
  displayGreen: function(key, value){
    if(value !== undefined){
      this.set('green',value);
    }else{
      return Math.round(this.get('green'));
    }
  }.property('green').cacheable(),
  
  blue: 255,
  displayBlue: function(key, value){
    if(value !== undefined){
      this.set('blue',value);
    }else{
      return Math.round(this.get('blue'));
    }
  }.property('blue').cacheable(),
  
  hue: 0,
  displayHue: function(key, value){
    if(value !== undefined){
      this.set('hue',value);
    }else{
      return Math.round(this.get('hue'));
    }
  }.property('hue').cacheable(),
  
  saturation: 0,
  displaySaturation: function(key, value){
    if(value !== undefined){
      this.set('saturation',value);
    }else{
      return Math.round(this.get('saturation'));
    }
  }.property('saturation').cacheable(),
  
  value: 255,
  displayValue: function(key, value){
    if(value !== undefined){
      this.set('value',value);
    }else{
      return Math.round(this.get('value'));
    }
  }.property('value').cacheable(),
  
  rgbDidChange: function(){
    var RGB = this.get('currentRGB');
    RGB.setIfChanged('red',this.get('red'));
    RGB.setIfChanged('green', this.get('green'));
    RGB.setIfChanged('blue', this.get('blue'));
    
    var HSV = this.RBGtoHSV(RGB);
    var newColor = this.RGBtoHEX(RGB);
    this.setIfChanged('selectedColor', newColor);
    this.setIfChanged('currentHSV', HSV);
    this.setIfChanged('currentRGB', RGB);
    this.updateHSV(HSV);
  }.observes('red', 'green', 'blue'), //only computed properties are cacheable
  
  hsvDidChange: function(){
    var HSV = this.get('currentHSV');
    HSV.setIfChanged('hue', this.get('hue'));
    HSV.setIfChanged('saturation', this.get('saturation'));
    HSV.setIfChanged('value', this.get('value'));
    
    var RGB = this.HSVtoRGB(HSV);
    var newColor = this.RGBtoHEX(RGB);
    this.setIfChanged('selectedColor', newColor);
    this.setIfChanged('currentHSV', HSV);
    this.setIfChanged('currentRGB', RGB);
    this.updateRGB(RGB);
  }.observes('hue', 'saturation', 'value'),
  
  selectedColorDidChange: function(){
    var sel = this.get('selectedColor');
    if(sel.length<6) return;
    if(sel){
      this.HEXtoRGB(sel);
    }
  }.observes('selectedColor'),
  
  updateRGB: function(RGB){
    this.setIfChanged('red', RGB.red);
    this.setIfChanged('green', RGB.green);
    this.setIfChanged('blue', RGB.blue);
  },
  
  updateHSV: function(HSV){
    this.setIfChanged('hue', HSV.hue);
    this.setIfChanged('saturation', HSV.saturation);
    this.setIfChanged('value', HSV.value);
  },
  
  /**convert color from HSV to RGB
  */
  HSVtoRGB: function (HSV) {
    var h = HSV.hue;
    var s = HSV.saturation;
    var v = HSV.value;
  
    // HSV contains values scaled as in the color wheel:
    // that is, all from 0 to 255. 
  
   // for ( this code to work, HSV.Hue needs
    // to be scaled from 0 to 360 (it//s the angle of the selected
    // point within the circle). HSV.Saturation and HSV.value must be 
    // scaled to be between 0 and 1.
    
    var r = 0;
    var g = 0;
    var b = 0;
    
    // Scale Hue to be between 0 and 360. Saturation
    // and value scale to be between 0 and 1.
    h = (h / 255 * 360) % 360;
    s = s / 255;
    v = v / 255;
    
    if ( s === 0 ) 
    {
      // If s is 0, all colors are the same.
      // This is some flavor of gray.
      r = v;
      g = v;
      b = v;
    } 
    else 
    {
      var p;
      var q;
      var t;

      var fractionalSector;
      var sectorNumber;
      var sectorPos;

      // The color wheel consists of 6 sectors.
      // Figure out which sector you//re in.
      sectorPos = h / 60;
      sectorNumber = Math.floor(sectorPos); //(int)

      // get the fractional part of the sector.
      // That is, how many degrees into the sector
      // are you?
      fractionalSector = sectorPos - sectorNumber;

      // Calculate values for the three axes
      // of the color. 
      p = v * (1 - s);
      q = v * (1 - (s * fractionalSector));
      t = v * (1 - (s * (1 - fractionalSector)));

      // Assign the fractional colors to r, g, and b
      // based on the sector the angle is in.
      switch (sectorNumber) 
      {
        case 0:
          r = v;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = v;
          b = p;
          break;
        case 2:
          r = p;
          g = v;
          b = t;
          break;
        case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
      }
    }
    
    var RGB = SC.Object.create({
      red:  r * 255,
      green: g * 255,
      blue: b * 255
    });

    return RGB;  
  },
  
  /**
  convert color from RGB to HSV
  */
  RBGtoHSV: function(RGB){
    // In this function, R, G, and B values must be scaled 
    // to be between 0 and 1.
    // HSV.Hue will be a value between 0 and 360, and 
    // HSV.Saturation and value are between 0 and 1.
    // The code must scale these to be between 0 and 255 for
    // the purposes of this application.

    var min;
    var max;
    var delta;

    var r = RGB.red / 255;
    var g = RGB.green / 255;
    var b = RGB.blue / 255;

    var h;
    var s;
    var v;

    min = Math.min(Math.min(r, g), b);
    max = Math.max(Math.max(r, g), b);
    v = max;
    delta = max - min;
    if ( max === 0 || delta === 0 ) {
      // R, G, and B must be 0, or all the same.
      // In this case, S is 0, and H is undefined.
      // Using H = 0 is as good as any...
      s = 0;
      h = 0;
    } 
    else {
      s = delta / max;
      if ( r == max ) {
        // Between Yellow and Magenta
        h = (g - b) / delta;
      } 
      else if ( g == max ) {
        // Between Cyan and Yellow
        h = 2 + (b - r) / delta;
      } 
      else {
        // Between Magenta and Cyan
        h = 4 + (r - g) / delta;
      }
    }
    // Scale h to be between 0 and 360. 
    // This may require adding 360, if the value
    // is negative.
    h *= 60;
    if ( h < 0 ) {
      h += 360;
    }

    // Scale to the requirements of this 
    // application. All values are between 0 and 255.
    var HSV = SC.Object.create({
      hue: h / 360 * 255,
      saturation: s * 255,
      value: v * 255
    });
    return  HSV;
  },
  
  /**
  convert a RGB format to HEX
  */
  RGBtoHEX: function(RGB) {
    return this._toHex(RGB.red) + this._toHex(RGB.green) + this._toHex(RGB.blue);
  },
  
  /**
  convert a HEX format to RGB
  */
  HEXtoRGB: function (color){
    var RGB = SC.Object.create({
      red: 255,
      green: 255,
      blue: 255
    });
    
    if(color && color.length > 0){
      RGB.red = parseInt(color.substring(0,2), 16);
    }
    if(color && color.length > 2){
      RGB.green = parseInt(color.substring(2,4), 16);
    }
    if(color && color.length > 4){
      RGB.blue = parseInt(color.substring(4,6), 16);
    }
    
    this.updateRGB(RGB);
  },
  /**
  convert a number to hexadecimal represenation
  */
  _toHex: function(N) {
    if (!N){
      return "00";
    }
    
    //N = Math.int(N); 
    if (N === 0 || (!N)){
      return "00";
    }
    
    N=Math.max(0,N); 
    N=Math.min(N,255); 
    N=Math.round(N);
    
    return "0123456789ABCDEF".charAt((N-N%16)/16) + "0123456789ABCDEF".charAt(N%16);
  },
  
  getColor: function(){
     //get x and y from the center and the calculate the angle of the new location
     var mousePoint = this.get('mousePoint');
     var delta = SC.Object.create({
       x: mousePoint.x - this.getPath('centerPoint.x'),
       y: mousePoint.y - this.getPath('centerPoint.y')
     });
     var degrees = this._calculateDegrees(delta);

     //get the distance from the center of the wheel to the new point
     var distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y)/this.get('radius');

     var brightness = this.get('value');
     if(!brightness){
       brightness = 255;
     }

     //calculate the RGB color, get first HSV
     var HSV = SC.Object.create({
       hue: degrees*255/360,
       saturation: distance*255,
       value: brightness 
     });
     this.set('currentHSV', HSV);

     var RGB = this.HSVtoRGB(HSV);
     
     this.set('currentRGB', RGB); //current is missspelled
     
     var newColor = this.RGBtoHEX(RGB);
     this.setIfChanged('selectedColor', newColor);
   },

   _calculateDegrees: function(point){ //make this method private
     var degrees;
     if(point.x === 0){
       if(point.y >0){
         degrees = 270;
       }
       else{
         degrees = 90;
       }
     }
     else{
       degrees = (-Math.atan(point.y/point.x))* SCUI.DEGREES_PER_RADIAN;

       if(point.x < 0){
         degrees+=180;
       }

       degrees = (degrees + 360) % 360;
     }

     return degrees;
   }
  
});