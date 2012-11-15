/**
@class Lite.ToggleButton
@extends Lite.Widget
@param {Object} config Object literal specifying configuration properties.
@param {Boolean} [config.autoToggle=true] Whether to auto toggle the button when clicked
@param {String} [config.type=toggle] Type of toggle button. Any one of 'toggle', 'radio', 'checkbox'.
@param {String} [config.selected=false] Automatically select this button
**/
function ToggleButton() {
    ToggleButton.superclass.constructor.apply(this, arguments);
}

/**
@property NS
@value 'button'
@type String
@static
**/
ToggleButton.NS = 'button';

/**
Default template for button creation from Lite.ToggleButton.createNode

@property TEMPLATE
@type Function
@static
**/
ToggleButton.TEMPLATE = Y.Lite.Button.TEMPLATE;

/**
Returns a new Y.Node already plugged with the ToggleButton plugin.

@method createNode
@param {Object} config Object literal specifying configuration properties
@param {String} [config.label] Content of the button node
@param {Function} [config.template=ToggleButton.TEMPLATE] Template to create the button from
@return Node
@static
**/
ToggleButton.createNode = function (config) {
    config = config || {};

    return Y.Node.create((config.template || ToggleButton.TEMPLATE)(config)).plug(ToggleButton);
};

Y.extend(ToggleButton, Y.Lite.Button, {

    initializer: function (config) {
        this._type = config.type || config.host.getData('type') || 'toggle';
        this._auto = config.autoToggle !== false;

        if (config.selected) {
            this.select();
        }
    },

    renderUI: function () {
        var role = 'toggle';

        if (this._type === 'radio') {
            role = 'radio';
        } else if (this._type === 'checkbox') {
            role = 'checkbox';
        }

        this.boundingBox.set('role', role);
    },

    bindUI: function () {
        if (this._auto) {
            this._handles.push(
                this.on('click', this.toggle, this)
            );
        }
    },

    /**
    @method toggle
    @param {Boolean} [selected] Forces the selected status to a certain value
    @chainable
    **/
    toggle: function (selected) {
        var button = this.boundingBox,
            selectedClass = this.getClassName('selected'),
            ariaState = 'aria-' + ((this._type === 'radio' || this._type === 'checkbox') ? 'checked' : 'pressed');

        if (typeof selected !== 'boolean') {
            selected = !button.hasClass(selectedClass);
        }

        button.toggleClass(selectedClass, selected)
              .set(ariaState, selected);

        /**
        Fires when the button changes its selected state

        @event toggle
        @param {Object} facade
        @param {Boolean} facade.selected The selected status of the button
        **/
        this.fire('toggle', {
            selected: selected
        });

        return this;
    },

    /**
    @method select
    @chainable
    **/
    select: function () {
        return this.toggle(true);
    },

    /**
    @method unselect
    @chainable
    **/
    unselect: function () {
        return this.toggle(false);
    },

    /**
    @method isSelected
    @return Boolean
    **/
    isSelected: function () {
        return this.boundingBox.hasClass(this.getClassName('selected'));
    }

});


Y.Lite.ToggleButton = ToggleButton;