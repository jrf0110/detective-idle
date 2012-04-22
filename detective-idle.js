(function(){
  var $, $framework = ($ != 'undefined' && $ != null), bindFn = ($framework && $.hasOwnKey('on')) ? 'on' : 'bind'
  , _addEvent = function(el, name, action){
    return $framework ? $(el).on(name, action) : el.addEventListener(name, action);
  }
  , _extend = function(obj1, obj2){
    var obj = {};
    for (var key in obj1){
      if (obj2.hasOwnProperty(key)){
        if (typeof obj1[key] == "object" && key != "el") obj[key] = _extend(obj1[key], obj2[key]);
        else obj[key] = obj2[key];
      }else{
        obj[key] = obj1[key];
      }
    }
    return obj;
  };
  var defaults = {
    idleInterval: 60000
  , el: document
  , monitoredEvents: {
      mousemove: true
    , click: true
    , touchmove: true
    , touchstart: true
    , keypress: true
    }
  };
  DetectiveIdle = (function(){
    var constructor = function(timeout, options){
      this.timeout = timeout;
      this.options = _extend(defaults, options);
      this.idle = 0;
      this.idleInterval = this.options.idleInterval;
      this.interval = false;
      this.events = {};
      this.eventTimes = [];
      this.eventTimesFired = [];
      var self = this, boundReset = function(e){ self.reset(e); };
      for (var key in this.options.monitoredEvents)
        this.options.monitoredEvents[key] && _addEvent(this.options.el, key, boundReset);
      return this;
    };
    constructor.prototype = {
      start: function(){
        var self = this;
        !this.interval && (this.interval = setInterval(function(){self._onTick()}, this.idleInterval));
        return this;
      }
    , stop: function(){
        clearInterval(this.interval);
        this.interval = false;
        this.reset();
        return this;
      }
    , reset: function(){
        this.idle = 0;
        if (this.eventTimesFired.length > 0){
          this.eventTimes = this.eventTimes.concat(this.eventTimesFired);
          this.eventTimesFired = [];
        }
        return this;
      }
    , at: function(time, action){
        return this.on(time, action);
      }
    , on: function(time, action){
        this._on(time + "", action);
        typeof time != "string" && this.eventTimes.push(time); // just a normal on function at this point
        return this;
      }
    , _on: function(name, action){
        if (Object.prototype.toString.call(action)[8] != "F") throw new TypeError;
        if (this.events.hasOwnProperty(name)){
          this.events[name].push(action);
        }else{
          this.events[name] = [action];
        }
        return this;
      }
    , _trigger: function(name, args){
        if (this.events.hasOwnProperty(name))
          for (var e = this.events[name], i = 0; i < e.length; i++) e[i].apply(this, args);
        return this;
      }
    , _triggerWarning: function(i){
        this._trigger(this.eventTimes[i] + "", this);
        this.eventTimesFired.push(this.eventTimes[i]);
        // Array Remove - By John Resig (MIT Licensed)
        var rest = this.eventTimes.slice(i + 1);
        this.eventTimes.length = i;
        this.eventTimes.push.apply(this.eventTimes, rest);
        return this;
      }
    , _onTick: function(){
        this.idle += this.idleInterval;
        // Fire off any events bound to specific times
        for (var i = 0; i < this.eventTimes.length; i++)
          this.idle >= this.eventTimes[i] && this._triggerWarning(i);
        if (this.idle >= this.timeout && this.idle != -1){
          this.stop();
          this._trigger('timeout');
        }
    }
    };
    return constructor;
  })();
}).call(this);
