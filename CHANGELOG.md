# Changelog

### v1.1.4

14.12.2018.

**Changed**

* Changed how custom event is dispatched.

-----

### v1.1.3

13.12.2018.

**Changed**

* Custom event is broadcasted out of `requestAnimationFrame`. This prevents waiting for double `rAF` calls if event handler is using it as well.

-----

### v1.1.2

30.07.2018.

**Added**

* Added `scrollPosition` as an `scrollPositionY` alias for backwards compatibility

-----

### v1.1.0

15.06.2018.

**Changed****Add**

* Passive events are used by default if browser supports them [#1](https://github.com/Stanko/window-scroll-manager/pull/1)

-----

### v1.0.0 and v1.0.1

15.06.2018.

**Changed**

* Renamed `scrollPosition` event property to `scrollPositionY`

**Added**

* Enabled horizontal scroll tracking and added `scrollPositionX` event property
* This changelog

-----

For changes prior version 1.0.0 please check the [commit list](https://github.com/Stanko/window-scroll-manager/commits/master).
