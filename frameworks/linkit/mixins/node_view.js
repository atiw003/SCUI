/*globals LinkIt*/

LinkIt.NodeView = {

  // PUBLIC PROPERTIES

  isNodeView: YES,
  
  delegate: null,
  
  // PUBLIC METHODS

  /**
    Override this to customize link endpoint location
  */
  endpointFor: function(link) {
    var frame = this.get('frame');
    return frame ? { x: frame.x + frame.width / 2, y: frame.y + frame.height / 2 } : { x: 0, y: 0 };
  },
  
  // PRIVATE METHODS

  /**
    When this node view moves, any links connected to it should redraw themselves as well.
  */
  _nv_frameDidChange: function() {
    var delegate = this.get('delegate');
    if (delegate && delegate.invalidateLinkViewsFor) {
      delegate.invalidateLinkViewsFor(this.get('content'));
    }
  }.observes('frame')

};
