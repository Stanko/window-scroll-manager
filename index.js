'use strict';

(function () {
  var instance = null;
  var instancesCount = 0;

  var INTERVAL = 16;
  var EVENT_NAME = 'window-scroll';

  // CustomEvent polyfill
  if (typeof window !== 'undefined' && typeof window.CustomEvent !== 'function') {
    var CustomEventPollyfill = function (
      event,
      params = { bubbles: false, cancelable: false, detail: undefined }
    ) {
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };

    CustomEventPollyfill.prototype = window.Event.prototype;

    window.CustomEvent = CustomEventPollyfill;
  }

  function ScrollManager(userInterval) {
    if (typeof window === 'undefined') {
      // Silently return null if it is used on server
      return null;
    }

    var interval = userInterval || INTERVAL;

    instancesCount++;

    if (instance) {
      return instance;
    }

    instance = this;

    // Bind handlers
    this.handleInterval = this.handleInterval.bind(this);

    this.intervalID = setInterval(this.handleInterval, interval);
  }

  ScrollManager.prototype.removeListener = function () {
    instancesCount--;

    if (instancesCount === 0) {
      // Remove and reset interval/animationFrame
      clearInterval(this.intervalID);
      this.intervalID = null;
      // Clear singleton instance
      instance = null;
    }
  };

  ScrollManager.prototype.destroy = function () {
    instancesCount == 0;

    // Remove and reset interval/animationFrame
    clearInterval(this.intervalID);
    this.intervalID = null;
    // Clear singleton instance
    instance = null;
  };

  ScrollManager.prototype.getScrollPosition = function () {
    // Get scroll position, with IE fallback
    return window.scrollY || document.documentElement.scrollTop;
  };

  ScrollManager.prototype.handleInterval = function () {
    var newScrollPosition = this.getScrollPosition();

    // Fire the event only when scroll position is changed
    if (newScrollPosition !== this.scrollPosition) {
      this.scrollPosition = newScrollPosition;

      var event = new CustomEvent(EVENT_NAME, {
        detail: {
          scrollPosition: newScrollPosition
        }
      });

      // Dispatch the event.
      window.dispatchEvent(event);
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    ScrollManager.default = ScrollManager;
    module.exports = ScrollManager;
  } else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
    // register as 'classnames', consistent with npm package name
    define('window-scroll-manager', [], function () {
      return ScrollManager;
    });
  } else {
    window.ScrollManager = ScrollManager;
  }
}).call(this);
