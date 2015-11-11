/**
 * HeadsUp 1.5.7
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
    function resizeHandler() {
      winHeight = window.innerHeight;
    }

    // Scroll handler function
    function scrollHandler() {

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
    }

    // Attach listeners
    if ( selector ) {

      // Resize function listener
      window.addEventListener( 'resize', throttle( resizeHandler ), false );

      // Scroll function listener
      window.addEventListener( 'scroll', throttle( scrollHandler ), false );
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

  // Throttle function with requestAnimationFrame
  function throttle( callback ) {
    var wait, args, context;
    return function() {
      if ( wait ) { return; }
      wait = true;
      args = arguments;
      context = this;
      requestAnimationFrame( function() {
        wait = false;
        callback.apply( context, args );
      });
    };
  }

  // Public API
  return headsUp;

});

// Instantiate HeadsUp
// headsUp.init( 'selector', {
//   delay : '75%',
//   sensitivity: 30
// });