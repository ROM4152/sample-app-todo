/**
 * Type definition of the Page Value Object
 * 
 * @typedef {Object} PageVO
 * @property {Function} type Page class constructor
 * @property {Array} transitionParams Page transition options
 */

/**
 * Application Router Implementation
 * 
 * @namespace
 */
var Router = {};

/**
 * Routing definitions collection
 * 
 * @static
 * @property {Array<PagevO>} routes collection of application
 */
Router.__routes = [];

/**
 * Application Routing history cache
 * 
 * @class RouteHistory
 * @version 1.0.0
 */
const RouteHistory = function() {
  var head = 0;
  var cache = [];
  
  /**
   * Returns page definition from history stack by specified path if user visited before
   *
   * @param {?string} path page routing path
   * @returnss {Object}
   */
  this.getHistoryByPath = function(path) {
    var page;
    
    // search path on history
    cache.some(function(history){
      if(history.path == path){
        page = history.instance;
        return true;
      }
    });
    
    return page;
  };
  
  /**
   * Pushes new page definition to history
   *
   * @param {String} path Routing path
   * @param {Object} params Routing data
   */
  this.push = function(path, params) {
    cache.push({
      path: path,
      params: params
    });
    
    head++;
  };
  
  /**
   * Clear history starting from head index
   */
  this.clearAfter = function() {
    if (head != 0) {
      cache = cache.slice(0, head);
    }
  };
  
  /**
   * This chaining method iterates history to next, if it has
   * 
   * @returns RouteHistory
   */
  this.next = function() {
    if (cache.length >= head) {
      head++;
    }
    return this;
  };
  
  /**
   * This chaining method iterates history to prev, if it has
   * 
   * @returns RouteHistory
   */
  this.prev = function() {
    if (head > 0) {
      head--;
    }

    return this;
  };
  
  /**
   * Clears all history
   * 
   * @returns RouteHistory
   */
  this.clear = function() {
    cache = [];

    return this;
  };
  
  /**
   * Returns page definition by current head index
   *
   * @returns {Object}
   */
  this.current = function() {
    return cache[head];
  };
};

/**
 * @type {RouteHistory}
 * @static
 * @private
 * 
 * Creates new routing history iterator
 */
Router.__history = new RouteHistory();

/**
 * Adds a new route definition
 * 
 * @param {String} path routing path of the page
 * @param {Function} pageClass constructor of the page class
 * @param {Object} transitionParams transition effect params of page changing
 */
Router.add = function(path, pageClass, transitionParams) {
  /**
   * @property
   * @private
   * @type {Array<PageVO>}
   */
  this.__routes[path] = {type: pageClass, transitionParams: transitionParams};
};

/**
 * Creates and shows a page by specified path and injects params.
 * 
 * @param {String} path routing path of page
 * @param {Object} params injects routing data to page
 */
Router.go = function(path, params) {
  var route = this.__routes[path];
  params = Object.assign({}, params);
  
  if(route.type){
    var page;
    if(!(page = this.__history.getHistoryByPath(path)) ) {
      page = new route.type(params);
      const instance = page;
      
      this
        .__history
        .push({
          path
          , params
          , instance
        });
    }
    
    page.setRouteParams(params);
    page.show.apply(page, route.transitionParams());

  } else {
    throw new Error("[ Router ] Page cannot be found on path : "+path);
  }
};

/**
 * Pushes new route definition to history, and clear after current history head
 * @static
 * @param {String} path routing path
 * @param {Object} routing data
 */
Router.pushHistory = function(path, params) {
  this.__history.push({path:path, params:params});
  this.__history.clearAfter();
};

/**
 * Shows next page in routing history
 * @static
 */
Router.next = function() {
  var history = this
    .__history
    .next()
    .current();
    
  if (history) {
    this
      .go
      .call(this, history.current());
  }
};

/**
 * Routes to previous page in routing history
 * @static
 */
Router.back = function() {
  Pages.back();
  
  return;
/*  var history = this
    .__history
    .prev()
    .current();
    
  if (history) {
    this
      .go
      .call(this, history.current());
  }
*/
}

/**
 * clears routing history
 * @static
 */
Router.clearHistory = function() {
  this.__history = [];
}

module.exports = Router;