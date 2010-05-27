/*globals SCUI LinkIt*/

sc_require('mixins/link_view');

LinkIt.LinksCollectionView = SCUI.SimpleCollectionView.extend({

  // PUBLIC PROPERTIES
  
  classNames: 'linkit-links-collection-view',

  delegate: null,
  
  exampleItemView: SC.View.extend(LinkIt.LinkView, {
    classNames: 'linkit-missing-example-view',
    layout: { width: 200, height: 50 },
    //backgroundColor: 'blue',
    
    didCreateLayer: function() {
      sc_super();
      this.invalidate();
    },
    
    invalidate: function() {
      //SC.Logger.debug('%@.invalidate()'.fmt(this));
      var delegate = this.get('delegate');
      var fromView, toView, fromFrame, toFrame;
      var top, left, width, height;

      if (delegate) {
        fromView = delegate.nodeViewFor(this.getPath('content.linkFrom'));
        toView = delegate.nodeViewFor(this.getPath('content.linkTo'));
        
        if (fromView && toView) {
          fromFrame = fromView.get('frame');
          toFrame = toView.get('frame');
          
          top = Math.min(fromFrame.y + fromFrame.height / 2, toFrame.y + toFrame.height / 2);
          left = Math.min(fromFrame.x + fromFrame.width / 2, toFrame.x + toFrame.width / 2);
          width = Math.abs(fromFrame.x - toFrame.x);
          height = Math.abs(fromFrame.y - toFrame.y);

          this.adjust({ top: top, left: left, width: width, height: height });
          this.displayDidChange();
        }
      }
    },

    render: function(context, firstTime) {
      //SC.Logger.debug('%@.render()'.fmt(this));
      var frame = this.get('frame');
      context.begin('canvas').addClass('base-layer').attr({ width: frame.width, height: frame.height }).end();
      this.invokeOnce('renderCanvas');
    },
    
    renderCanvas: function() {
      //SC.Logger.debug('%@.renderCanvas()'.fmt(this));
      var canvasElement = this.$('canvas.base-layer');
      var frame = this.get('frame');
      var c;

      if (frame && canvasElement && canvasElement.length > 0) {
        c = canvasElement[0].getContext('2d');

        if (c) {
          c.clearRect(0, 0, frame.width, frame.height);

          c.lineWidth = 3;
          c.strokeStyle = '#000000';
          c.beginPath();
          c.moveTo(0, 0);
          c.lineTo(frame.width, frame.height);
          c.closePath();
          c.stroke();
        }
      }
    }
  }),
  
  // PUBLIC METHODS
  
  invalidateItemViewsFor: function(items) {
    var that = this, view;

    if (items && items.isEnumerable) {
      items.forEach(function(item) {
        var view = that.itemViewForItem(item);
        if (view && view.invalidate) {
          view.invalidate();
        }
      });
    }
  }

});
