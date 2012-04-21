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

By default, Detective Idle ticks every minute. So, unless you override that option, your events only have the potential to fire once a minute.


```javascript
// You can also pass in an options hash
var idleObserver = new DetectiveIdle(1000*60*10, {
  idleInterval: 1000 // Ticks every second
});
```