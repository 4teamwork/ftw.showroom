var timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

export default function waitFor(condition, callback, options) {
  options = options || {};
  checkConditionAndSetTimeout(condition, callback, options, currentTime());
}

function checkConditionAndSetTimeout(condition, callback, options, startedAt) {
  if (condition.call()) {
    callback();
  } else {
    setWaitForTimeout(condition, callback, options, startedAt);
  }
}

function setWaitForTimeout(condition, callback, options, startedAt) {
  setTimeout(function() {
    if (currentTime() - startedAt > timeout) {
      if (condition.call()) {
        callback();
      }
      else {
        if (options.onTimeout) {
          options.onTimeout();
        } else {
          throw new Error("waitFor: timeout ("+ timeout +" ms) exceeded.");
        }
      }
    } else {
      checkConditionAndSetTimeout(condition, callback, options, startedAt);
    }
  }, 15);
}

function currentTime() {
  return new Date().getTime();
}
