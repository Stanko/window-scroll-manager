# Window Scroll Manager

[![npm version](https://img.shields.io/npm/v/window-scroll-manager.svg?style=flat-square)](https://www.npmjs.com/package/window-scroll-manager)
[![npm downloads](https://img.shields.io/npm/dm/window-scroll-manager.svg?style=flat-square)](https://www.npmjs.com/package/window-scroll-manager)

Small library that broadcasts more performant `window-scroll` events.

[Demo](https://stanko.github.io/window-scroll-manager/)

[Changelog](CHANGELOG.md)

## What is this?

Listening to window `onscroll` event is very expensive and ineffective, so this library tries to get better performance out of it.

Implementation is simple - it listens to window `scroll` event, but broadcasts custom `window-scroll` event once one per `requestAnimationFrame`. By my benchmarks it behaves much better.

If your event handler is doing any repaint logic, consider doing the logic it in `requestAnimationFrame`.

Idea came from [MDN](https://developer.mozilla.org/en-US/docs/Web/Events/scroll#Example), but I tried to take it one step further by making this [singleton](https://en.wikipedia.org/wiki/Singleton_pattern) scroll manager. It will use passive events if browser supports them.

One note for Safari, negative scroll values will be returned as 0.

## Usage

Get it from [npm](https://www.npmjs.com/package/window-scroll-manager):

```sh
npm install window-scroll-manager
```

Import it and use it:

```js
import ScrollManager from 'window-scroll-manager'

const sm = new ScrollManager();

console.log(sm.getScrollPosition());
// -> { scrollPositionX: 0, scrollPositionY: 0 }

window.addEventListener('window-scroll', function(e) {
  console.log('Vertical scroll position is: ' + e.detail.scrollPositionY);
  console.log('Horizontal scroll position is: ' + e.detail.scrollPositionX);

  requestAnimationFrame(function() {
    // repaint logic goes here
    // example:
    // rotateDiv.style.transform = 'rotate(' + e.detail.scrollPositionY / 2 + 'deg)';
  });
});
```

## API

  * `getScrollPosition()` - returns current window scroll position object.
    ```js
    {
      scrollPositionX: 0,
      scrollPositionY: 100,
    }
    ```
  * `removeListener()` - reduces internal reference counter by one, and if it reaches 0 destroys the instance. Reference counter is increased every time `new ScrollManager` is called. For example, this is useful when scroll manager is used in React high order component (to track if any component is still using it). Use with caution.
  * `destroy()` - destroys the singleton instance and removes `scroll` listener. Use with caution, call `removeListener` do this for you.
