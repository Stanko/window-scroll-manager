'use strict';

(function() {
  var instance = null;
  var instancesCount = 0;
  var ticking = false;

  var EVENT_NAME = 'window-scroll';

  // ------------------------------------------------
  // Passive events support detection
  // ------------------------------------------------
  function detectPassiveEvents() {
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      var passive = false;
      var options = Object.defineProperty({}, 'passive', {
        get: function() { passive = true; }
      });
      // note: have to set and remove a no-op listener instead of null
      // (which was used previously), becasue Edge v15 throws an error
      // when providing a null callback.
      // https://github.com/rafrex/detect-passive-events/pull/3
      var noop = function() {};
      window.addEventListener('testPassiveEventSupport', noop, options);
      window.removeEventListener('testPassiveEventSupport', noop, options);

      return passive;
    }

    return false;
  }

  var supportsPassiveEvents = detectPassiveEvents();

  // ------------------------------------------------
  // CustomEvent polyfill
  // ------------------------------------------------
  if (typeof window !== 'undefined' && typeof window.CustomEvent !== 'function') {
    var CustomEventPollyfill = function(event, userParams) {
      var params = {
        bubbles: userParams.bubbles || false,
        cancelable: userParams.cancelable || false,
        detail: userParams.detail || undefined // eslint-disable-line no-undefined
      };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };

    CustomEventPollyfill.prototype = window.Event.prototype;

    window.CustomEvent = CustomEventPollyfill;
  }

  // ------------------------------------------------
  // Scroll manager
  // ------------------------------------------------
  function ScrollManager() {
    if (typeof window === 'undefined') {
      // Silently return null if it is used on server
      return null;
    }

    // Increase reference count
    instancesCount++;

    // If singleton instance exists, return it rather than creating a new one
    if (instance) {
      return instance;
    }

    // Save singleton instance
    instance = this;

    // Bind handlers
    this.handleScroll = this.handleScroll.bind(this);

    // Use passive listener when supported with fallback to capture option
    this.eventListenerOptions = supportsPassiveEvents ? { passive: true } : true;

    // Add scroll listener
    window.addEventListener('scroll', this.handleScroll, this.eventListenerOptions);
  }

  ScrollManager.prototype.removeListener = function() {
    instancesCount--;

    // There is not components listening to our event
    if (instancesCount === 0) {
      this.destroy();
    }
  };

  ScrollManager.prototype.destroy = function() {
    // Remove event listener
    window.removeEventListener('scroll', this.handleScroll, this.eventListenerOptions);

    // Clear singleton instance and count
    instance = null;
    instancesCount = 0;
  };

  ScrollManager.prototype.getScrollPosition = function() {
    // Get scroll position, with IE fallback
    var scrollPositionY = window.scrollY || document.documentElement.scrollTop;
    var scrollPositionX = window.scrollX || document.documentElement.scrollLeft;

    // Disable overscrolling in safari
    if (scrollPositionY < 0) {
      scrollPositionY = 0;
    }
    if (scrollPositionX < 0) {
      scrollPositionX = 0;
    }

    return {
      scrollPositionY: scrollPositionY,
      // Alias for scrollPositionY for backwards compatibility
      scrollPosition: scrollPositionY,
      scrollPositionX: scrollPositionX
    };
  };

  ScrollManager.prototype.handleScroll = function() {
    // Fire the event only once per requestAnimationFrame
    if (!ticking) {
      ticking = true;
      var self = this;

      window.requestAnimationFrame(function() {
        var event = new CustomEvent(EVENT_NAME, {
          detail: self.getScrollPosition()
        });

        // Dispatch the event.
        window.dispatchEvent(event);
        ticking = false;
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    ScrollManager.default = ScrollManager;
    module.exports = ScrollManager;
  } else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) { // eslint-disable-line no-undef
    // register as 'window-scroll-manager', consistent with npm package name
    define('window-scroll-manager', [], function() { // eslint-disable-line no-undef
      return ScrollManager;
    });
  } else {
    window.ScrollManager = ScrollManager;
  }
}).call(this);
