/*globals SCUI*/

sc_require('system/dictionary');

SCUI.SimpleCollectionView = SC.View.extend({

  // PUBLIC PROPERTIES
  
  classNames: 'scui-simple-collection-view',
  
  content: null,
  
  delegate: null,
  
  exampleItemView: SC.View.extend({
    classNames: 'scui-missing-example-view',
    layout: { width: 200, height: 50 },
    backgroundColor: 'green'
  }),

  // PUBLIC METHODS
  
  init: function() {
    sc_super();
    this.addProbe('content');
  },
  
  didCreateLayer: function() {
    sc_super();
    this._itemViewCache = SCUI.Dictionary.create();
    this._scv_contentDidChange();
  },

  updateItemViews: function() {
    SC.Logger.debug('%@._updateItemViews()'.fmt(this));
  
    var content = this.get('content');
    var oldCache = this._itemViewCache;
    var newCache = SCUI.Dictionary.create();
    var that = this;
    var delegate = this.get('delegate');
  
    this.beginPropertyChanges();
  
    if (content && content.isEnumerable) {
      content.forEach(function(item, idx) {
        var key = SC.guidFor(item);
        var itemView = oldCache.get(key);
        
        if (!itemView) {
          // itemView = that.get('exampleItemView');
          // itemView = that.createChildView(itemView, {
          //   layerId: '%@-%@'.fmt(SC.guidFor(that), key),
          //   content: item,
          //   delegate: delegate
          // });
          itemView = that.createItemView(item);
          itemView.set('layout', that.layoutForItemView(itemView, item));
        }
  
        newCache.set(key, itemView);

        that.didAddItem(item);
      });
    }
    
    if (!newCache.isEqual(oldCache)) {
      this.removeAllChildren();
  
      newCache.forEach(function(itemView) {
        that.appendChild(itemView);
      });
      
      // clean up old views
      oldCache.forEach(function(itemView) {
        var item = itemView.get('content');
        var key = SC.guidFor(item);
  
        if (!newCache.contains(key)) {
          itemView.set('content', null);
          itemView.destroy();
          that.didRemoveItem(item);
        }
      });
    }

    this._itemViewCache = newCache;
    this.endPropertyChanges();
  },

  layoutForItemView: function(itemView, item) {
    var frame = itemView ? itemView.get('frame') : { width: 200, height: 50 };
    return { left: 0, top: 0, width: frame.width, height: frame.height };
  },

  createItemView: function(item) {
    return this.createChildView(this.get('exampleItemView'), {
      layerId: '%@-%@'.fmt(SC.guidFor(this), SC.guidFor(item)),
      content: item,
      delegate: this.get('delegate')
    });
  },

  itemViewForEvent: function(evt) {
    var responder = this.getPath('pane.rootResponder');
    var itemViews = this._itemViewCache;
    var itemView, base, baseLen, element, layer, id, key;
    
    if (responder && itemViews) {
      base = SC.guidFor(this) + '-';
      baseLen = base.length;
      element = evt.target;
      layer = this.get('layer');
      
      while(element && (element !== document) && (element !== layer)) {
        id = SC.$(element).attr('id');
        
        if ((id.length > base.length) && (id.indexOf(base) === 0)) {
          key = id.slice(id.lastIndexOf('-') + 1);
          
          if (itemView = itemViews.get(key)) {
            break;
          }
        }

        element = element.parentNode;
      }
    }

    return itemView;
  },

  itemViewForItem: function(item) {
    return this._itemViewCache.get(SC.guidFor(item));
  },

  didAddItem: function(item) {
    console.log('%@.didAddItem(%@)'.fmt(this, item));
  },
  
  didRemoveItem: function(item) {
    console.log('%@.didRemoveItem(%@)'.fmt(this, item));
  },

  // PRIVATE METHODS
  
  _scv_contentDidChange: function() {
    this.invokeOnce('updateItemViews'); // don't change DOM from observer run loop, just schedule an update
  }.observes('*content.[]'),

  // PRIVATE PROPERTIES
  
  _itemViewCache: null
  
});
