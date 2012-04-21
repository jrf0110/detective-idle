(function(){
  DetectiveIdle = (function(){
    var $el = $(document);
    var constructor = function(timeout, options){
      this.timeout = timeout;
      this.options = _.extend({
        idleInterval: 60000
      }, options);
      this.idle = 0;
      this.idleInterval = this.options.idleInterval;
      this.interval = false;
      this.eventTimes = [];
      this.eventTimesFired = [];
      var self = this, boundReset = _.bind(this.reset, this);
      $el.mousemove(boundReset);
      $el.click(boundReset);
      $el.keypress(boundReset);
      $el.on('touchmove', boundReset);
      $el.on('touchstart', boundReset);
      return this;
    };
    constructor.prototype = {
      reset: function(){
        this.idle = 0;
        this.eventTimes = this.eventTimes.concat(this.eventTimesFired);
        this.eventTimesFired = [];
        return this;
      }
    , at: function(time, action){
        this.on(time + "", action);
        console.log(typeof time);
        typeof time != "string" && this.eventTimes.push(time); // just a normal on function at this point
        return this;
      }
    , triggerWarning: function(i){
        this.trigger(this.eventTimes[i] + "", this);
        this.eventTimesFired.push(this.eventTimes[i]);
        this.eventTimes.removeAt(i);
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