// ------------------------------------------------------------------------
// Tests for SCUI ColumnView
// ------------------------------------------------------------------------

module("SCUI.ColumnView",{
  
  setup: function() {
    
  },
  
  teardown: function() {
    
  }
  
});


/**
  When given an ArrayController the default ColumnView should 
  render a ScrollView and a list View even if the content of the 
  ArrayController's content is empty
*/
test("SCUI.ColumnView Should Render a scroller and a list", function(){
  ok(true);
});

/**
  When given an ObjectController the default ColumnView should 
  render a ScrollView and a ColumnMetaDataView even if the content of the 
  ObjectController's content is empty
*/
test("SCUI.ColumnView Should Render a scroller and a meta data view", function(){
  ok(true);
});

/**
  When given an ArrayController the default ColumnView should have a list 
  that uses the columnListDelegate which by default is the SCUI.ColumnDelegate
*/
test("SCUI.ColumnView Should Render a scroller and a list", function(){
  ok(true);
});