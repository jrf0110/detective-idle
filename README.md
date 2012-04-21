# Idle detection in plain ol' Javascript

Detective Idle is a dead simple way of executing actions for when a user is inactive for certain periods of time. Here's how to use it:


```javascript
// Pass in the number of microseconds you want to be the timeout - 5 min
var idleObserver = new DetectiveIdle(1000*60*5);

// Now you can bind to the 'timeout' event
idleObserver.on('timeout', function(){
  logout();
});

// Or you can bind to specific times
idleObserver.at(1000*60*4, function(){
  alertUser("You've been inactive for 4 minutes. You will be automatically logged in one minute");
});
idleObserver.at(1000*60*4 + 1000*30, function(){
  alertUser("HAY! You're about to logged out!");
});
```

## More Options

Detective Idle sets some options that you can override. Stuff like how often it checks for events and what events should constitute as activity. By default, it checks for events every minute and the events it checks for are:

* mousemove
* click
* touchmove
* touchstart
* keypress


```javascript
// You can also pass in an options hash
var idleObserver = new DetectiveIdle(1000*60*10, {
  idleInterval: 1000 // Ticks every second
, monitoredEvents: {
    mousemove: true // Listen for mouse move events
  , click: false // But don't listen to click events
  }
});
```

## More Usage

By default, Detective Idle is bound to the document element, but you can just as easily pass in another element. For example, maybe you're wanting to record some information about somebody's typing habits. In which case, you're really only concerned about exact times of inactivity and not necessarily a timeout.

```javascript
var idleObserver = new DetectiveIdle(-1, {
  el: $('textarea') // Monitor the text input
, idleInterval: 1000 // We really want some granular information
  // All we're really concerned with are keyboard events
, monitoredEvents: {
    mousemove: false
  , click: false
  , touchmove: false
  , touchstart: false
  }
});
idleObserver.at(1000*10, function(){
  alertUser("You haven't typed anything for 10 seconds. Is something wrong?");
});
```

## Using with frameworks

Detective Idle checks for the existence of a jQuery-like framework and uses that for element event binding if it exists. If you're not using a framework, it will fallback to addEventListener. So feel free to pass in javascript dom elements or jQuery elements or whatever framework elements you want, just as long they have 'on' or 'bind' methods to use.

I don't really care about supporting older browsers. If you have to support an older browser and you still want to use this script, then include jQuery. I don't want to re-invent event listeners just for a few lines of code.