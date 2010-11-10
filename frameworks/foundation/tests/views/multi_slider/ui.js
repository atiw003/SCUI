// ========================================================================
// SCUI.MultiSliderView Tests
// ========================================================================
/*global module test htmlbody ok equals same stop start */


htmlbody('<style> .sc-static-layout { border: 1px red dotted; } </style>');

(function() {
  var pane = SC.ControlTestPane.design()
    .add('horizontal', SCUI.MultiSliderView.extend({
        layout: {width: 300,height: 80,centerY: 0, centerX: 0},
        bindControls: YES,
        enableAreas: YES,
        areaMargin: [20,20],
        controls: [
          {
            control: {
              position: 0.15,
              label: 'D',
              width: 20,
              height: 20,
              isLocked: YES,
              align: 'bottom'
            },
            area: {
              backgroundColor: 'rgba(0,0,0,.25)'
            }
          },
          {
            control: {
              label: 'B',
              position: 0.75,
              width: 40,
              align: 0.9,
              backgroundColor: '#cecece'
            },
            area: {
              backgroundColor: 'rgba(0,0,0,.25)'
            }
          },
          {
            control: {
              position: 0.5,
              width: 10,
              align: 'top',
              height: 80,
              backgroundColor: '#000000',
              enableValue: NO
            },
            area: {
              backgroundColor: 'rgba(0,0,0,.5)',
              label: 'CPrime'
            }
          },
          
          {
            control: {
              position: 0.25,
              label: 'Cc',
              width: 40,
              align: 0.5
            },
            area: {
              backgroundColor: 'rgba(0,0,0,.1)'
            }
          },

          {
            control: {
              position: 1,
              label: 'A',
              width: 40
            },
            area: {
              backgroundColor: 'rgba(0,0,0,1)',
              label: 'APrime',
              align: 'top'
            }
          }
        ]
      }))
    .add('vertical',  SCUI.MultiSliderView.extend({
          layout: {width: 50,height: 400,centerY: 0, centerX: 0},
          backgroundColor: 'rgba(255,255,255,1)',
          enableAreas: YES,
          backgroundColor: '#cecece',
          controls: [
            {
              control: {
                position: 0.35,
                label: 'D',
                width: 20,
                height: 20
              },
              area: {
                backgroundColor: 'rgba(0,0,0,.25)',
                label: 'DPrime'
              }
            },
            {
              control: {
                label: 'B',
                position: 0.75,
                width: 40
              },
              area: {
                backgroundColor: 'rgba(0,0,0,.75)',
                label: 'BPrime'
              }
            },
            {
              control: {
                position: 0.5,
                label: 'C',
                align: 'right',
                width: 20,
                height: 20
              },
              area: {
                backgroundColor: 'rgba(0,0,0,.5)',
                label: 'CPrime'
              }
            },

            {
              control: {
                position: 1,
                label: 'A',
                width: 20,
                align: 'left'
              },
              area: {
                backgroundColor: 'rgba(0,0,0,1)',
                label: 'APrime'
              }
            }
          ]
        }));

  pane.show();
  window.pane = pane ;
  
  
  // ..........................................................
  // TEST VIEWS
  //
  
  module('SCUI.MultiSliderView ui', pane.standardSetup());
  
  test('[horizontal] Check for 4 Controls and 5 areas', function () {
    var view = pane.view('horizontal');
    ok(view.$('.scui-multi-slider-control').length === 4, '4 Controls shown');
    ok(view.$('.scui-multi-slider-area').length === 5, '5 Areas showing');
  });
  
  test('[horizontal] Check for control label values being empty or null', function () {
    var view = pane.view('horizontal');
    var children = view.get('childViews');
    
    ok(children[5].getPath('value'), 'First Control value IS NOT empty');
    ok(children[6].getPath('value'), 'Second Control value IS NOT empty');
    ok(!children[7].getPath('value'), 'Third Control value IS empty');
    ok(children[8].getPath('value'), 'Fourth Control value IS NOT empty');
    
  });
  
  test('[horizontal] Check for area label values being empty or null', function () {
    var view = pane.view('horizontal');
    var children = view.get('childViews');
    
    ok(!children[0].getPath('childViews.firstObject.value'), 'First Area label value IS empty');
    ok(!children[1].getPath('childViews.firstObject.value'), 'Second Area label value IS empty');
    ok(children[2].getPath('childViews.firstObject.value'), 'Third Area label value IS NOT empty');
    ok(!children[3].getPath('childViews.firstObject.value'), 'Fourth Area label value IS empty');
    ok(children[4].getPath('childViews.firstObject.value'), 'Fifth Area label value IS NOT empty');    
  });
  
  test('[horizontal] Check alignment of controls',function () {
    var view = pane.view('horizontal');
    var children = view.get('childViews');
    ok(children[5].get('layout').bottom === 0, 'First control is bottom: 0');
    ok(children[6].get('layout').centerY === 0, 'Second control is centerY: 0');
    ok(children[7].get('layout').top === 0, 'Third control is top: 0');
    ok(children[8].get('layout').bottom === 8, 'Fourth control is bottom: 8 (0.9 is the align value)');
  });
  
  test('[horizontal] Check dimensions of controls',function () {
    var view = pane.view('horizontal');
    var children = view.get('childViews');
    ok(children[5].get('layout').width === 20 && children[5].get('layout').height === 20, 'First control width: 20 and height: 20');
    ok(children[6].get('layout').width === 40 && children[6].get('layout').height === 20, 'Second control is width: 40 and height: 20');
    ok(children[7].get('layout').width === 10 && children[7].get('layout').height === 80, 'Third control is width: 10 and height: 80');
    ok(children[8].get('layout').width === 40 && children[8].get('layout').height === 20, 'Fourth control is width: 40 and height: 20');
  });
  
  test('[vertical] Check for 0 areas and 4 controls', function () {
    var view = pane.view('vertical');
    ok(view.$('.scui-multi-slider-area').length === 0, '0 areas displayed');
    ok(view.$('.scui-multi-slider-control').length === 4, '4 controls displayed');
  });
  
  test('[vertical] Check alignment', function () {
    var view = pane.view('vertical');
    var kids = view.get('childViews');
    
    ok(kids[1].get('layout').right === 0, 'C Control is right aligned');
    ok(kids[0].get('layout').centerX === 0, 'D Control is center aligned');
    ok(kids[2].get('layout').centerX === 0, 'B Control is center aligned');
    ok(kids[3].get('layout').left === 0, 'A Control is left aligned');
  });
  
  
})();