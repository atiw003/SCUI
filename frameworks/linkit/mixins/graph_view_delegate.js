/*globals LinkIt*/

LinkIt.GraphViewDelegate = {

  // PUBLIC PROPERTIES
  
  isGraphViewDelegate: YES,
  
  // PUBLIC METHODS

  /*
    Whenever we begin dragging a link, this question will be asked for each possible
    drop target.
  */
  graphViewCanConnect: function(graphView, fromNode, toNode, fromView, toView) {
    return YES;
  },

  /*
    After a completed edge proposal, this will be called, giving you an opportunity
    to set up and return a custom edge object.
  */
  graphViewEdgeForProposedConnection: function(graphView, fromNode, toNode, fromView, toView) {
    return null;
  },

  /*
    Called just prior to adding a new edge.
  */
  graphViewShouldAddEdge: function(graphView, edge) {
    return YES;
  },

  /*
    Opportunity for the graph view delegate to handle actually adding the edge and
    anything else associated with it.
    Return YES if the delegate will handle it, NO otherwise.
  */
  graphViewAddEdge: function(graphView, edge) {
    return NO;
  },
  
  /*
    Notification after adding a new edge.
  */
  graphViewDidAddEdge: function(graphView, edge) {
  },
  
  graphViewShouldRemoveEdge: function(graphView, edge) {
    return YES;
  },
  
  graphViewRemoveEdge: function(graphView, edge) {
    return NO;
  },
  
  graphViewDidRemoveEdge: function(graphView, edge) {
  },

  graphViewShouldDeleteNodes: function(graphView, nodeSelection) {
    return nodeSelection;
  },
  
  graphViewDeleteNodeSelection: function(graphView, nodeSelection) {
    return NO;
  },
  
  graphViewDidDeleteNodeSelection: function(graphView, nodeSelection) {
  }

};
