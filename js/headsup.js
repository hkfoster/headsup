/**
 * HeadsUp 1.5.9
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

    // Attach listeners
    if ( selector ) {

      // Scroll throttle function init
      throttle( 'scroll', 'optimizedScroll' );

      // Resize throttle function init
      throttle( 'resize', 'optimizedResize' );

      // Resize function listener
      window.addEventListener( 'optimizedResize', resizeHandler, false );

      // Scroll function listener
      window.addEventListener( 'optimizedScroll', scrollHandler, false );

    }

    // Resize handler function
    function resizeHandler() {

      // Update window height variable
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

  // Event throttle function - http://mzl.la/1OasQYz
  function throttle( type, name, obj ) {
    obj = obj || window;
    var running = false;
    var func = function() {
      if ( running ) { return; }
      running = true;
      requestAnimationFrame( function() {
        obj.dispatchEvent( new CustomEvent( name ) );
        running = false;
      });
    };
    obj.addEventListener( type, func );
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