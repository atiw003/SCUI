// ==========================================================================
// SCUI.SearchableTreeController
// ==========================================================================

sc_require('core');

/** @class
  
  An tree controller that is searchable and creates a flat search results like
  OSX Finder and Windows Explorer
  
  @extends SC.TreeController
  @author Evin Grano
  @author Brandon Blatnick
  @version 0.5
  @since 0.5
*/

SCUI.SearchableTreeController = SC.TreeController.extend(
/** @scope SCUI.SearchableTreeController.prototype */ 
{
   search: null,
   searchResults: [],
   searchKey: 'name',
   iconKey: 'icon',
   nameKey: 'name',

   init: function(){
     sc_super();
     this.set('searchResults', []);
     this._runSearch();
   },

   _searchDidChange: function(){
     this._runSearch();
   }.observes('search', 'content'),

  _sanitizeSearchString: function(str){
    var specials = [
        '/', '.', '*', '+', '?', '|',
        '(', ')', '[', ']', '{', '}', '\\'
    ];
    var s = new RegExp('(\\' + specials.join('|\\') + ')', 'g');
    return str.replace(s, '\\$1');
  },

  _runSearch: function(){
    var searchResults = [];
    var search = this.get('search');
    var c = this.get('content');
    if(search === null || search === '' || search === undefined){ 
      this.set('searchResults', c);
    }
    else {
      search = this._sanitizeSearchString(search).toLowerCase();
      var searchRegex = new RegExp(search,'i');
      var searchKey = this.get('searchKey');
      this._iconKey = this.get('iconKey');
      this._nameKey = this.get('nameKey');
      searchResults = this._runSearchOnItem(c, search, searchRegex, searchKey);
      
      // create the root search tree
      var searchedTree = SC.Object.create({
        treeItemIsExpanded: YES,
        treeItemChildren: searchResults
      });
      this.set('searchResults', searchedTree);
    }
  },
  
  /** 
    @private
    Returns a flat list of matches for the foldered tree item.
  */
  _runSearchOnItem: function(treeItem, search, searchRegex, searchKey) {
    var searchMatches = [], iconKey = this.get('iconKey'),
        searchedList, key, searchLen, 
        children, nameKey = this._nameKey, that;
    
    if (SC.none(treeItem)) return searchMatches;
    
    children = treeItem.get('treeItemChildren');
    if (!children) children = treeItem.get('children');
    that = this;
    children.forEach( function(child){      
      if (child.treeItemChildren) {
        var searchedList = that._runSearchOnItem(child, search, searchRegex, searchKey);
        searchedList.forEach( function(m){ searchMatches.push(m); });
      }
      
      if (searchKey && child.get(searchKey)) {
        key = child.get(searchKey).toLowerCase();
        if(key.match(searchRegex)){
          searchMatches.push(child);
        } 
      }
    });

    // Add properties for basic selection support
    searchMatches.set('allowsSelection', this.get('allowsSelection'));
    searchMatches.set('allowsMultipleSelection', this.get('allowsMultipleSelection'));
    searchMatches.set('allowsEmptySelection', this.get('allowsEmptySelection'));

    return searchMatches;
  }
});

SCUI.SearchableTreeController.mixin(/** @scope SCUI.SearchableTreeController */ {
  
  sanitizeSearchString: function(str) {
    var specials = [
        '/', '.', '*', '+', '?', '|',
        '(', ')', '[', ']', '{', '}', '\\'
    ];
    var s = new RegExp('(\\' + specials.join('|\\') + ')', 'g');
    return str.replace(s, '\\$1');
  }
});

