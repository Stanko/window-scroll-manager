# Window Scroll Manager

[Demo](https://stanko.github.io/window-scroll-manager/)

## What it this?

Listening to window's `onscroll` event is very expensive and ineffective,
so this library takes different approach on it.
It is a *singleton* which sets interaval (60 times per second) when it checks for window scroll position.
If the scroll position has changed it dispatches custom event (`window-scroll`) with the new position.

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
  console.log('Scroll position is: ' + e.detail.scrollPosition;
});
```

## Options

`ScrollManager` accepts only one argument `interval` which is the time interval to be used with `setInterval`.
Default is `16` (~62fps).

Please note that `ScrollManager` is singleton, so `interval` of the first instance will be used.

## API

  * `getScrollPosition` - returns current window scroll position.
  * `destroy` - destroys the singleton instance and removes interval.

```
const sm = new ScrollManager();

console.log(sm.getScrollPosition()); // -> 0

sm.destroy();
sm = null;
```
