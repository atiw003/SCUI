/*globals LinkIt SCUI*/

LinkIt.Graph = {

  // PUBLIC PROPERTIES
  
  /**
    @read-only
  */
  graphNodes: null,

  /**
    @read-only
  */
  graphEdges: null,
  
  // PUBLIC METHODS

  init: function() {
    sc_super();
    this.set('graphNodes', SCUI.Dictionary.create());
    this.set('graphEdges', SCUI.Dictionary.create());
  },

  addNode: function(node) {
    SC.Logger.debug('%@.addNode(%@)'.fmt(this, node));
  },
  
  removeNode: function(node) {
    SC.Logger.debug('%@.removeNode(%@)'.fmt(this, node));
  },
  
  addEdge: function(edge) {
    SC.Logger.debug('%@.addEdge(%@)'.fmt(this, edge));
  },
  
  removeEdge: function(edge) {
    SC.Logger.debug('%@.removeEdge(%@)'.fmt(this, edge));
  }
  
  // PRIVATE METHODS
  
  // PRIVATE PROPERTIES
  
};
