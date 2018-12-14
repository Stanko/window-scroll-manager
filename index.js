'use strict';

(function() {
  var instance = null;
  var instancesCount = 0;
  var ticking = false;

  var EVENT_NAME = 'window-scroll';

  var isWindowDefined = typeof window !== 'undefined';

  // ------------------------------------------------
  // Passive events support detection
  // ------------------------------------------------
  function detectPassiveEvents() {
    if (isWindowDefined && typeof window.addEventListener === 'function') {
      var passive = false;
      var options = Object.defineProperty({}, 'passive', {
        get: function() { passive = true; }
      });
      // note: have to set and remove a no-op listener instead of null
      // (which was used previously), because Edge v15 throws an error
      // when providing a null callback.
      // https://github.com/rafrex/detect-passive-events/pull/3
      var noop = function() {};
      window.addEventListener('TEST_PASSIVE_EVENT_SUPPORT', noop, options);
      window.removeEventListener('TEST_PASSIVE_EVENT_SUPPORT', noop, options);

      return passive;
    }

    return false;
  }

  var supportsPassiveEvents = detectPassiveEvents();

  // ------------------------------------------------
  // Custom Event detection
  // ------------------------------------------------
  var supportsCustomEvents = isWindowDefined && typeof window.CustomEvent === 'function';

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
      // Alias for scrollPositionY for backwards compatibility
      scrollPosition: scrollPositionY,
      scrollPositionY: scrollPositionY,
      scrollPositionX: scrollPositionX
    };
  };

  ScrollManager.prototype.handleScroll = function() {
    // Fire the event only once per requestAnimationFrame
    if (!ticking) {
      ticking = true;

      var event;

      if (supportsCustomEvents) {
        event = new CustomEvent(EVENT_NAME, {
          detail: this.getScrollPosition()
        });
      } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(EVENT_NAME, false, false, this.getScrollPosition());
      }

      window.dispatchEvent(event);

      window.requestAnimationFrame(function() {
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
