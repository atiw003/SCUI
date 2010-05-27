/*globals SCUI LinkIt*/

LinkIt.Link = {

  // PUBLIC PROPERTIES
  
  isLink: YES,

  /**
    The link name should be unique per graph.
  */
  linkNameKey: 'name',

  /**
    @String
    Name of the node at which this link ends.
  */
  linkTo: null,

  /**
    @read-only
    @String
    Name of the node at which this link starts.
  */
  linkFrom: null

};
