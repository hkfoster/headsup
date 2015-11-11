/**
 * HeadsUp 1.5.8
 * A smart header for smart people
 * @author Kyle Foster (@hkfoster)
 * @license MIT
 */
;( function( root, factory ) {
  if ( typeof define === 'function' && define.amd ) {
    define( factory );
  } else if ( typeof exports === 'object' ) {
    module.exports = factory;
  } else {
    root.headsUp = factory( root );
  }
})( this, function( root ) {

  'use strict';

  // Public API object
  var headsUp = {};

  // Overridable defaults
  headsUp.defaults = {
    delay       : 300,
    sensitivity : 20
  };

  // Init function
  headsUp.init = function( element, settings ) {

    // Scoped variables
    var options    = extend( this.defaults, settings ),
        selector   = document.querySelector( element ),
        docHeight  = document.body.scrollHeight,
        winHeight  = window.innerHeight,
        calcDelay  = ( options.delay.toString().indexOf( '%' ) != -1 ) ? parseFloat( options.delay ) / 100.0 * docHeight - winHeight : options.delay,
        oldScrollY = 0;

    // Resize handler function
    var resizeHandler = throttle( function() {

      // Update window height variable
      winHeight = window.innerHeight;

    }, 250 );

    // Scroll handler function
    var scrollHandler = throttle( function() {

      // Scoped variables
      var newScrollY = window.pageYOffset,
          pastDelay  = newScrollY > calcDelay,
          goingDown  = newScrollY > oldScrollY,
          fastEnough = newScrollY < oldScrollY - options.sensitivity,
          rockBottom = newScrollY < 0 || newScrollY + winHeight >= docHeight;

      // Where the magic happens
      if ( pastDelay && goingDown ) {
        selector.classList.add( 'heads-up' );
      } else if ( !goingDown && fastEnough && !rockBottom || !pastDelay ) {
        selector.classList.remove( 'heads-up' );
      }

      // Keep on keeping on
      oldScrollY = newScrollY;

    }, 100 );

    // Attach listeners
    if ( selector ) {

      // Resize function listener
      window.addEventListener( 'resize', resizeHandler, false );

      // Scroll function listener
      window.addEventListener( 'scroll', scrollHandler, false );

    }
  };

  // Extend function
  function extend( a, b ) {
    for( var key in b ) {
      if( b.hasOwnProperty( key ) ) {
        a[ key ] = b[ key ];
      }
    }
    return a;
  }

  // Throttle function (http://bit.ly/1eJxOqL)
  function throttle( fn, threshhold, scope ) {
    var threshold = threshhold || 250,
        previous, deferTimer;
    return function () {
      var context = scope || this,
          current = Date.now(),
          args    = arguments;
      if ( previous && current < previous + threshhold ) {
        clearTimeout( deferTimer );
        deferTimer = setTimeout( function () {
        previous   = current;
        fn.apply( context, args );
        }, threshhold );
      } else {
        previous = current;
        fn.apply( context, args );
      }
    };
  }

  // Public API
  return headsUp;

});

// Instantiation
headsUp.init( 'selector', {
  delay       : '75%', // percentage of document height
  delay       : 300,   // number of pixels from top of document
  sensitivity : 30
});