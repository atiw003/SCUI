/*globals SCUI LinkIt*/

sc_require('views/nodes_collection');
sc_require('views/links_collection');

LinkIt.GraphView = SC.View.extend({

  // PUBLIC PROPERTIES
  
  classNames: 'linkit-graph-view',
  
  content: null,

  /**
    @read-only
  */
  links: null,
  
  acceptsFirstResponder: YES,

  /**
    @read-only
  */
  nodesCollectionView: null,

  /**
    @read-only
  */
  linksCollectionView: null,
  
  // PUBLIC METHODS
  
  init: function() {
    sc_super();

    this.set('links', SCUI.Dictionary.create());
    this._nodeCache = SCUI.Dictionary.create();
    this._linkCachesByNode = SCUI.Dictionary.create();
    this._invalidatedNodes = SCUI.Dictionary.create();

    this._nodesByName = SCUI.Dictionary.create();
    this._linksByNode = SCUI.Dictionary.create();
    this._linkOwners = SCUI.Dictionary.create();

    this._contentDidChange();
  },

  createChildViews: function() {
    var nodesView, linksView;

    linksView = this.createChildView(LinkIt.LinksCollectionView, {
      contentBinding: SC.Binding.from('links', this).oneWay(),
      delegate: this
    });
    this.set('linksCollectionView', linksView);
    
    nodesView = this.createChildView(LinkIt.NodesCollectionView, {
      contentBinding: SC.Binding.from('content', this).oneWay(),
      //contentBinding: SC.Binding.from('graph.nodes', this).oneWay(),
      delegate: this
    });
    this.set('nodesCollectionView', nodesView);
    
    this.set('childViews', [linksView, nodesView]);
  },

  getNodeByName: function(name) {
    return this._nodesByName.get(name);
  },
  
  nodeViewFor: function(node) {
    var nodesCollectionView = this.get('nodesCollectionView');
    node = (SC.typeOf(node) === SC.T_STRING) ? this._nodesByName.get(node) : node;
    return nodesCollectionView ? nodesCollectionView.itemViewForItem(node) : null;
  },

  invalidateLinkViewsFor: function(node) {
    //SC.Logger.debug('%@.invalidateLinkViewsFor(node: %@)'.fmt(this, node));
    var linksCollectionView = this.get('linksCollectionView');
    linksCollectionView.invalidateItemViewsFor(this._linksByNode.get(this._getNodeName(node)));
  },

  // PRIVATE METHODS
  
  _contentDidChange: function() {
    this.invokeOnce('_updateNodes'); // don't do anything in the observer run loop, just schedule an update
  }.observes('*content.[]'),
  
  _updateNodes: function() {
    SC.Logger.debug('%@._updateNodes()'.fmt(this));
    var that = this, toAdd, toRemove;
    
    this._nodeCache.diff(this._toDictionary(this.get('content')), toAdd = [], toRemove = []);

    toAdd.forEach(function(item) {
      that._nodeCache.set(SC.guidFor(item), item);
      that._addNode(item);
    });

    toRemove.forEach(function(item) {
      that._nodeCache.remove(SC.guidFor(item));
      that._removeNode(item);
    });
  },

  _addNode: function(node) {
    SC.Logger.debug('%@._addNode(%@)'.fmt(this, node));
    var linksKey, name, key;

    if (node) {
      key = SC.guidFor(node);

      // map node name to node object
      this._nodesByName.set(this._getNodeName(node), node);

      // add links observer
      linksKey = node.get('nodeLinksKey');
      if (linksKey) {
        node.addObserver('%@.[]'.fmt(linksKey), this, '_linksDidChange', node);
        this._linksDidChange(null, null, null, node); // force an initial update
      }

      // force redraw of any related links
      this.invalidateLinkViewsFor(node);
    }
  },

  _removeNode: function(node) {
    SC.Logger.debug('%@._removeNode(%@)'.fmt(this, node));
    var nodeKey, links, linksKey;
    var that = this;

    if (node) {
      nodeKey = SC.guidFor(node);

      // Remove links observer
      linksKey = node.get('nodeLinksKey');
      if (linksKey) {
        node.removeObserver('%@.[]'.fmt(linksKey), this, '_linksDidChange');
      }
      
      // Delete link cache
      links = this._getOrCreateLinkCache(node);
      if (links) {
        links.forEach(function(link) {
          that._removeLink(link, node);
        });
      }
      this._deleteLinkCache(node);
      
      // Remove from the list of invalidated nodes if present
      this._invalidatedNodes.remove(nodeKey);

      // Remove from name map
      this._nodesByName.remove(this._getNodeName(node));

      // force redraw of any related links
      this.invalidateLinkViewsFor(node);
    }
  },

  /**
    'context' should be the node whose links changed
  */
  _linksDidChange: function(sender, key, value, context) {
    SC.Logger.debug('%@._linksDidChange(context: %@)'.fmt(this, context));
    this._invalidatedNodes.add(SC.guidFor(context), context); // dictionary automatically avoids duplicate entries
    this.invokeOnce('_updateLinks'); // don't do anything in the observer run loop, just schedule an update
  },

  _updateLinks: function() {
    var that = this;
    var invalidatedNodes = this._invalidatedNodes;
    
    SC.Logger.debug('%@._updateLinks(%@)'.fmt(this, this._invalidatedNodes.get('length')));

    this._invalidatedNodes = SCUI.Dictionary.create();

    if (invalidatedNodes && invalidatedNodes.isEnumerable) {
      invalidatedNodes.forEach(function(node) {
        var nodeKey = SC.guidFor(node);
        var linkCache, toAdd, toRemove;

        linkCache = that._getOrCreateLinkCache(node); // get the last known links for this node
        linkCache.diff(that._toDictionary(that._getNodeLinks(node)), toAdd = [], toRemove = []); // diff with the latest
        
        toAdd.forEach(function(link) {
          linkCache.set(SC.guidFor(link), link);
          that._addLink(link, node);
        });
        
        toRemove.forEach(function(link) {
          linkCache.remove(SC.guidFor(link), link);
          that._removeLink(link, node);
        });
      });
    }
  },

  _addLink: function(link, owner) {
    var fromName, toName, links, linkKey, owners;

    SC.Logger.debug('%@._addLink(link: %@, owner: %@)'.fmt(this, link, owner));

    if (link) {
      linkKey = SC.guidFor(link);

      // associate this link with the 'from' node
      fromName = link.get('linkFrom');
      if (!(links = this._linksByNode.get(fromName))) {
        this._linksByNode.set(fromName, links = SCUI.Dictionary.create());
      }
      links.add(linkKey, link);

      // associate this link with the 'to' node
      toName = link.get('linkTo');
      if (!(links = this._linksByNode.get(toName))) {
        this._linksByNode.set(toName, links = SCUI.Dictionary.create());
      }
      links.add(linkKey, link);
      
      // register an owner of this link
      if (!(owners = this._linkOwners.get(linkKey))) {
        this._linkOwners.set(linkKey, owners = SCUI.Dictionary.create());
      }
      owners.add(this._getNodeName(owner));

      // add the links collection
      links = this.get('links');
      if (links) {
        links.set(linkKey, link);
      }
    }
  },

  _removeLink: function(link, owner) {
    var fromName, toName, links, linkKey, owners;

    SC.Logger.debug('%@._removeLink(link: %@, owner: %@)'.fmt(this, link, owner));

    if (link) {
      linkKey = SC.guidFor(link);
      
      // disassociate this link from 'from' node
      fromName = link.get('linkFrom');
      links = this._linksByNode.get(fromName);
      if (links) {
        links.remove(linkKey);
        
        if (!links.get('length')) {
          this._linksByNode.remove(fromName);
        }
      }
      
      // disassociate this link from 'to' node
      toName = link.get('linkTo');
      links = this._linksByNode.get(toName);
      if (links) {
        links.remove(linkKey);
        
        if (!links.get('length')) {
          this._linksByNode.remove(toName);
        }
      }

      // unregister this owner of the link
      owners = this._linkOwners.get(linkKey);
      if (owners) {
        owners.remove(this._getNodeName(owner));
      }

      // if no more owners of this link, remove it and the empty owners list
      if (!owners || !owners.get('length')) {
        this._linkOwners.remove(linkKey);

        links = this.get('links');
        if (links) {
          links.remove(linkKey);
        }
      }
    }
  },

  _getOrCreateLinkCache: function(node) {
    var ret, nodeKey = SC.guidFor(node);

    if (!(ret = this._linkCachesByNode.get(nodeKey))) {
      this._linkCachesByNode.set(nodeKey, ret = SCUI.Dictionary.create());
    }
    
    return ret;
  },

  _deleteLinkCache: function(node) {
    this._linkCachesByNode.remove(SC.guidFor(node));
  },

  _getNodeLinks: function(node) {
    return node ? node.get(node.get('nodeLinksKey')) : null;
  },

  _getNodeName: function(node) {
    return node ? node.get(node.get('nodeNameKey')) : null;
  },
  
  _toDictionary: function(enumerable) {
    var ret = SCUI.Dictionary.create();
    
    if (enumerable && enumerable.isEnumerable) {
      enumerable.forEach(function(item) {
        ret.add(SC.guidFor(item), item);
      });
    }

    return ret;
  },

  // PRIVATE PROPERTIES
  
  _nodeCache: null,
  _linkCachesByNode: null,
  _invalidatedNodes: null,

  _nodesByName: null,
  _linksByNode: null,
  _linkOwners: null
  
});
