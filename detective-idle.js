(function(){
  DetectiveIdle = (function(){
    var el = document, $;
    var _addEvent = function(name, action){
      return ($ != 'undefined' && $ != null) ? $(el).on(name, action) : el.addEventListener(name, action);
    };
    var _extend = function(obj1, obj2){
      var obj = {};
      for (var key in obj1){
        if (obj2.hasOwnProperty(key)){
          if (typeof obj1[key] == "object") obj[key] = _extend(obj1[key], obj2[key]);
          else obj[key] = obj2[key];
        }else{
          obj[key] = obj1[key];
        }
      }
      return obj;
    };
    var defaults = {
      idleInterval: 60000
    , monitoredEvents: {
        mousemove: true
      , click: true
      , touchmove: true
      , touhstart: true
      , keypress: true
      }
    };
    var constructor = function(timeout, options){
      this.timeout = timeout;
      this.options = _extend(defaults, options);
      this.idle = 0;
      this.idleInterval = this.options.idleInterval;
      this.interval = false;
      this.events = {};
      this.eventTimes = [];
      this.eventTimesFired = [];
      var self = this, boundReset = function(){ self.reset(); };

      for (var key in this.options.monitoredEvents){
        this.options.monitoredEvents[key] && _addEvent(key, boundReset);
      }

      console.log(this);

      return this;
    };
    constructor.prototype = {
      reset: function(){
        this.idle = 0;
        if (this.eventTimesFired.length > 0){
          this.eventTimes = this.eventTimes.concat(this.eventTimesFired);
          this.eventTimesFired = [];
        }
        return this;
      }
    , at: function(time, action){
        this.on(time + "", action);
        typeof time != "string" && this.eventTimes.push(time); // just a normal on function at this point
        return this;
      }
    , on: function(name, action){
        if (Object.prototype.toString.call(action)[8] != "F") throw new TypeError;
        if (this.events.hasOwnProperty(name)){
          this.events[name].push(action);
        }else{
          this.events[name] = [action];
        }
        return this;
      }
    , trigger: function(name, args){
        if (this.events.hasOwnProperty(name)){
          var e = this.events[name], i = 0;
          for (; i < e.length; i++){
            e[i].apply(this, args);
          }
        }
        return this;
      }
    , triggerWarning: function(i){
        this.trigger(this.eventTimes[i] + "", this);
        this.eventTimesFired.push(this.eventTimes[i]);
        // Array Remove - By John Resig (MIT Licensed)
        var rest = this.eventTimes.slice(i + 1);
        this.eventTimes.length = i;
        this.eventTimes.push.apply(this.eventTimes, rest);
        return this;
      }
    , onTick: function(){
        this.idle += this.idleInterval;
        // Fire off any events bound to specific times
        for (var i = 0; i < this.eventTimes.length; i++)
          this.idle >= this.eventTimes[i] && this.triggerWarning(i);
        if (this.idle >= this.timeout){
          this.stop();
          this.trigger('timeout');
        }
    }
    , start: function(){
        var self = this;
        !this.interval && (this.interval = setInterval(function(){self.onTick()}, this.idleInterval));
        return this;
      }
    , stop: function(){
        clearInterval(this.interval);
        this.interval = false;
        this.reset();
        return this;
      }
    };
    return constructor;
  })();
}).call(this);