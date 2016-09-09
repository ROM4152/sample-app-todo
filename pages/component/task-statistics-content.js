const TaskProgressBarComp = require("./progressbar-comp.js");
const Component           = require("../../app/core/component.js");
const SMFConsole          = require("../../app/core/log.js");
const TodoStore           = require("../../app/domain/todo-store.js");

const TaskStatisticsContent = function(finder) {
  Component.apply(this, [{
      width: "98%"
    , height: "80%"
    , borderWidth: 0
    , layoutType: SMF.UI.LayoutType.FLOW
    , verticalGap: 0
    , showScrollbar: true
  }]);
  
  this._items = [];
  // saves curent scope
  const _that = this;
  // invalidates component
  const update = function() {
    const grouped = TodoStore.groupByPropName("type")(TodoStore.find(finder));
    _that.clear();
    Object.keys(grouped)
      .forEach(function(key) {
        var bar = new TaskProgressBarComp(key, grouped[key]);
        _that.add(bar);
        _that._items.push(bar);
      });
  };
  
  try{
    update();
    // listen Todostore data change stream
    TodoStore
      .changeHandler$()
      .subscribe(function() {
        update();
      });
  } catch(e) {
    SMFConsole.error("[TaskStatisticsContent]", e);
  }
};

TaskStatisticsContent.prototype = Object.create(Component.prototype);

TaskStatisticsContent.prototype.show = function(){
  this._items.forEach(function(bar){
    bar.animate();
  })
};

module.exports = TaskStatisticsContent;