(function(){
  DetectiveIdle = (function(){
    var el = document, $;
    var addEvent = function(name, action){
      console.log(name);
      console.log(action);
      return ($ != 'undefined' && $ != null) ? $(el).on(name, action) : el.addEventListener(name, action);
    };
    // Array Remove - By John Resig (MIT Licensed)
    var arrayRemoveAt = function(array, from, to) {
      var rest = array.slice((to || from) + 1 || array.length);
      array.length = from < 0 ? array.length + from : from;
      return array.push.apply(array, rest);
    };
    var constructor = function(timeout, options){
      this.timeout = timeout;
      this.options = _.extend({
        idleInterval: 60000
      , monitoredEvents: {
          mousemove: true
        , click: true
        , touchmove: true
        , touhstart: true
        , keypress: true
        }
      }, options);
      this.idle = 0;
      this.idleInterval = this.options.idleInterval;
      this.interval = false;
      this.eventTimes = [];
      this.eventTimesFired = [];
      var self = this, boundReset = _.bind(this.reset, this);

      for (var key in this.options.monitoredEvents){
        this.options.monitoredEvents[key] && addEvent(key, boundReset);
      }

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
    , triggerWarning: function(i){
        this.trigger(this.eventTimes[i] + "", this);
        this.eventTimesFired.push(this.eventTimes[i]);
        arrayRemoveAt(this.eventTimes, i);
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
        !this.interval && (this.interval = setInterval(_.bind(this.onTick, this), this.idleInterval));
        return this;
      }
    , stop: function(){
        clearInterval(this.interval);
        this.interval = false;
        this.reset();
        return this;
      }
    };
    _.extend(constructor.prototype, Backbone.Events);
    return constructor;
  })();
}).call(this);