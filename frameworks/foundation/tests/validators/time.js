// ========================================================================
// SCUI.Validators.Time Tests
// ========================================================================

/**
  The Test Suite for the Time field validator
  
  @author Mike Ball
  @version Beta1.1
  @since Beta1.1
*/

var validator = SCUI.Validators.Time.create();

module("Time Validator");

test("Bad Values",function(){
  ok(SC.typeOf(validator.objectForFieldValue("8")) === SC.T_ERROR, "not a valid time");
  same(validator.fieldValueForObject("8", null, YES), "8", "not a valid time");
  ok(SC.typeOf(validator.objectForFieldValue("8:")) === SC.T_ERROR, "not a valid time");
  same(validator.fieldValueForObject("8:", null, YES), "8:", "not a valid time");
  ok(SC.typeOf(validator.objectForFieldValue("8:0")) === SC.T_ERROR, "not a valid time");
  same(validator.fieldValueForObject("8:0", null, YES), "8:0", "not a valid time");
});

test("Good Values",function(){
  same(validator.objectForFieldValue("8:00"), 8*60*60 , "valid time");
  same(validator.fieldValueForObject(8*60*60, null, YES), "8:00", "valid time");
});


