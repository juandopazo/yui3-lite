/**
@class Lite.Button
@extends Lite.Widget
@param config {Object} Object literal specifying configuration properties.
**/
function Button() {
    Button.superclass.constructor.apply(this, arguments);
}

/**
@property NS
@value 'button'
@type String
@static
**/
Button.NS = 'button';

Button.TRIGGER_EVENT = 'click';

/**
Default template for button creation from Lite.Button.createNode

@method TEMPLATE
@return String
@static
**/
Button.TEMPLATE = function (data) {
    return Y.Lang.sub('<button>{label}</button>', data);
};

/**
Returns a new Y.Node already plugged with the Button plugin.

@method createNode
@param {Object} config Object literal specifying configuration properties
@param {String} [config.label] Content of the button node
@param {Function} [config.template=Button.TEMPLATE] Template to create the button from
@return Node
@static
**/
Button.createNode = function (config) {
    config = config || {};

    return Y.Node.create((config.template || Button.TEMPLATE)(config)).plug(Button);
};

Y.extend(Button, Y.Lite.Widget, {

    CONTENT_SELECTOR: null,

    initializer: function (config) {
        if (config.disabled) {
            this.disable();
        }
    },

    renderUI: function () {
        var boundingBox = this.boundingBox,
            tagName = boundingBox.get('tagName').toLowerCase();

        if (tagName !== 'button' && tagName !== 'input') {
            boundingBox.set('role', 'button');
        }
    },

    syncUI: function () {
        var boundingBox = this.boundingBox;
        boundingBox.toggleClass(this.getClassName('disabled'), boundingBox.get('disabled'));
    },

    _toggleDisabled: function (disabled) {
        this.boundingBox
            .set('disabled', disabled)
            .toggleClass(this.getClassName('disabled'), disabled);

        return this;
    },

    /**
    Enable the button

    @method enable
    @chainable
    **/
    enable: function () {
        return this._toggleDisabled(false);
    },

    /**
    Disable the button
    @method disable
    @chainable
    **/
    disable: function () {
        return this._toggleDisabled(true);
    }
});

Y.Lite.Button = Button;