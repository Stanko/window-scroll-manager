# Window Scroll Manager

Small library that broadcasts more performant `window-scroll` events.

[Demo](https://stanko.github.io/window-scroll-manager/)

## What it this?

Listening to window `onscroll` event is very expensive and ineffective,
so this library tries to get better performance out of it.

Implementation is simple - it listens to window `scroll` event,
but triggers it one `requestAnimationFrame` at the time.
It broadcasts custom `window-scroll` event, and by my benchmarks it behaves much better.

Idea came from [MDN](https://developer.mozilla.org/en-US/docs/Web/Events/scroll#Example),
but I tried to take it one step further by making one scroll manager.
Manager is a [singleton](https://en.wikipedia.org/wiki/Singleton_pattern) instance that broadcasts custom event
`window-scroll`, that can be listened to, rather than `scroll` directly.

Please note that version `0.2.x` got rid of the `setInterval` approach.

## Usage

Get it from [npm](https://www.npmjs.com/package/window-sroll-manager):

```sh
npm install window-scroll-manager
```

Import it and use it:

```js
import ScrollManager from 'window-scroll-manager'

const sm = new ScrollManager();

window.addEventListener('window-scroll', function(e) {
  console.log('Scroll position is: ' + e.detail.scrollPosition);
});
```

## Options

## API

  * `getScrollPosition()` - returns current window scroll position.
  * `destroy()` - destroys the singleton instance and removes `scroll` listener.
  * `removeListener()` - reduces internal reference counter by one, and if it reaches 0 destroys the instance. Reference counter is increased every time `new ScrollManager` is called. For example, this is useful when scroll manager is used in React high order component (to track if any component is still using it). Use with caution.

```js
const sm = new ScrollManager();

console.log(sm.getScrollPosition()); // -> 0

sm.destroy();
```
