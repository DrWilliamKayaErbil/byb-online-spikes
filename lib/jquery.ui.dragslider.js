//this code solves this problem: http://stackoverflow.com/questions/5955343/

(function( $, undefined ) {

$.widget("ui.dragslider", $.ui.slider, {

    options: $.extend({},$.ui.slider.prototype.options,{rangeDrag:false}),

    _create: function() {
      $.ui.slider.prototype._create.apply(this,arguments);
      this._rangeCapture = false;
    },

    _mouseCapture: function( event ) {
      var o = this.options;

      if ( o.disabled ) return false;

      if(event.target == this.range.get(0) && o.rangeDrag == true && o.range == true) {
        this._rangeCapture = true;
        this._rangeStart = null;
      }
      else {
        this._rangeCapture = false;
      }

      $.ui.slider.prototype._mouseCapture.apply(this,arguments);

      if(this._rangeCapture == true) {
          this.handles.removeClass("ui-state-active").blur();
      }

      return true;
    },

    _mouseStop: function( event ) {
      this._rangeStart = null;
      return $.ui.slider.prototype._mouseStop.apply(this,arguments);
    },

    _slide: function( event, index, newVal ) {
      if(!this._rangeCapture) {
        return $.ui.slider.prototype._slide.apply(this,arguments);
      }

      if(this._rangeStart == null) {
        this._rangeStart = newVal;
      }

      var oldValLeft = this.options.values[0],
          oldValRight = this.options.values[1],
          slideDist = newVal - this._rangeStart,
          newValueLeft = oldValLeft + slideDist,
          newValueRight = oldValRight + slideDist,
          allowed;

      if ( this.options.values && this.options.values.length ) {
        if(newValueRight > this._valueMax() && slideDist > 0) {
          slideDist -= (newValueRight-this._valueMax());
          newValueLeft = oldValLeft + slideDist;
          newValueRight = oldValRight + slideDist;
        }

        if(newValueLeft < this._valueMin()) {
          slideDist += (this._valueMin()-newValueLeft);
          newValueLeft = oldValLeft + slideDist;
          newValueRight = oldValRight + slideDist;
        }

        if ( slideDist != 0 ) {
          newValues = this.values();
          newValues[ 0 ] = newValueLeft;
          newValues[ 1 ] = newValueRight;

          // A slide can be canceled by returning false from the slide callback
          allowed = this._trigger( "slide", event, {
            handle: this.handles[ index ],
            value: slideDist,
            values: newValues
          } );

          if ( allowed !== false ) {
            this.values( 0, newValueLeft, true );
            this.values( 1, newValueRight, true );
          }
          this._rangeStart = newVal;
        }
      }



    },
  /*
  values: function( index, newValue ) {
    var vals,
        newValues,
        i;

    if ( arguments.length > 1 ) {
      this.options.values[ index ] = this._trimAlignValue( newValue );
      this._refreshValue();
      this._change( null, index );
      return;
    }

    if ( arguments.length ) {
      if ( $.isArray( arguments[ 0 ] ) ) {
        vals = this.options.values;
        newValues = arguments[ 0 ];
        for ( i = 0; i < vals.length; i += 1 ) {
          vals[ i ] = this._trimAlignValue( newValues[ i ] );
          this._change( null, i );
        }
        this._refreshValue();
        return;
      } else {
        if ( this.options.values && this.options.values.length ) {
          return this._values( index );
        } else {
          return this.value();
        }
      }
    } else {
      return this._values();
    }
  }
  */
});

})(jQuery);
