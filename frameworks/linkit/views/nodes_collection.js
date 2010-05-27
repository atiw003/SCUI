/*globals SCUI LinkIt*/

sc_require('mixins/node_view');

LinkIt.NodesCollectionView = SCUI.SimpleCollectionView.extend({

  // PUBLIC PROPERTIES
  
  classNames: 'linkit-nodes-collection-view',

  ownerDelegate: null,

  exampleItemView: SC.LabelView.extend(LinkIt.NodeView, {
    classNames: 'linkit-missing-node-view',
    layout: { width: 200, height: 50 },
    backgroundColor: 'green',
    textAlign: SC.ALIGN_CENTER,
    contentValueKey: 'name'
  }),

  // PUBLIC METHODS
  
  mouseDown: function(evt) {
    var itemView, ret = NO;
    
    this._dragData = null;
    
    if (evt && (evt.which === 1)) { // left mouse button
      itemView = this.itemViewForEvent(evt);
      
      if (itemView) {
        this._dragData = {
          layout: SC.clone(itemView.get('layout')),
          startPageX: evt.pageX,
          startPageY: evt.pageY,
          itemView: itemView,
          content: itemView.get('content'),
          didMove: NO
        };
        
        ret = YES; // absorb this event
      }
    }

    return ret;
  },

  mouseDragged: function(evt) {
    var dx, dy, ret = NO;
    
    if (this._dragData) {
      this._dragData.didMove = YES;
      
      dx = evt.pageX - this._dragData.startPageX;
      dy = evt.pageY - this._dragData.startPageY;

      this._dragData.itemView.adjust({
        left: this._dragData.layout.left + dx,
        top: this._dragData.layout.top + dy
      });

      ret = YES;
    }
    
    return ret;
  },

  mouseUp: function(evt) {
    var ret = NO;
    var item, position, frame;

    if (this._dragData && this._dragData.didMove) {
      frame = this._dragData.itemView.get('frame');
      item = this._dragData.itemView.get('content');

      if (frame) {
        this._setItemPosition(item, { x: frame.x, y: frame.y });
      }
      
      ret = YES;
    }
    
    this._dragData = null;
    return ret;
  },

  layoutForItemView: function(itemView, item) {
    var frame = itemView ? itemView.get('frame') : { width: 200, height: 50 };
    var position = this._getItemPosition(item) || { x: 0, y: 0 };
    return { left: position.x, top: position.y, width: frame.width, height: frame.height };
  },

  didAddItem: function(item) {
    var positionKey;

    if (item && item.addObserver) {
      positionKey = item.get('nodePositionKey');
      if (positionKey) {
        item.addObserver(positionKey, this, '_itemPositionDidChange');
      }
    }
  },

  didRemoveItem: function(item) {
    var positionKey;
    
    if (item && item.removeObserver) {
      positionKey = item.get('nodePositionKey');
      if (positionKey) {
        item.removeObserver(positionKey, this, '_itemPositionDidChange');
      }
    }
  },

  // PRIVATE METHODS

  _itemPositionDidChange: function(sender, key, value, context) {
    SC.Logger.debug('%@._itemPositionDidChange(sender: %@, key: %@, value: %@, context: %@)'.fmt(this, sender, key, value, context));
    var position = this._getItemPosition(sender) || { x: 0, y: 0 };
    var itemView = this.itemViewForItem(sender);
    
    if (itemView) {
      itemView.adjust({ left: position.x, top: position.y });
    }
  },

  _getItemPosition: function(item) {
    var posKey, pos;

    if (item) {
      posKey = item.get('positionKey') || 'position';
      pos = item.get(posKey);

      if (pos) {
        pos = { x: (parseFloat(pos.x) || 0), y: (parseFloat(pos.y) || 0) };
      }
    }

    return pos;
  },
  
  /**
    Encapsulates the standard way the dashboard attempts to store the last
    position on a dashboard element.
  */
  _setItemPosition: function(item, pos) {
    var posKey;

    if (item) {
      posKey = item.get('positionKey') || 'position';
      item.set(posKey, pos);
    }
  },
  
  // PRIVATE PROPERTIES
  
  _dragData: null
  
});
