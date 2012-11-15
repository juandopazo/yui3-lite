/**
@class Lite.ButtonGroup
@extends Lite.Widget
@param {Object} config Object literal specifying configuration properties.
  @param {String} [config.type] Type of the button group. May be `toggle`,
    `radio`, `checkbox` or undefined.
  @param {Array} [config.buttons=[]] A list of buttons to create and
    configuration options for their button plugins
**/
function ButtonGroup() {
    ButtonGroup.superclass.constructor.apply(this, arguments);
}

/**
@property NS
@type String
@value 'buttongroup'
@static
**/
ButtonGroup.NS = 'buttongroup';

/**
@property BUTTON_SELECTOR
@type String
@static
**/
ButtonGroup.BUTTON_SELECTOR = '> *';

/**
@method TEMPLATE
@param {Object} data Object containing the data to use in the template
@return string
@static
**/
ButtonGroup.TEMPLATE = Y.Template.Micro.compile(
    '<div><div>' +
        '<% Y.Array.each(data.buttons, function (button) { %>' +
            '<button><%= button.label %></button>' +
        '<% }); %>' +
    '</div></div>'
);

/**
Returns a new Y.Node already plugged with the ButtonGroup plugin.

@method createNode
@param {Object} config Object literal specifying configuration properties
  @param {String} [config.type] Type of the button group. May be `toggle`,
    `radio`, `checkbox` or undefined.
  @param {Array} [config.buttons=[]] A list of buttons to create and
    configuration options for their button plugins
  @param {Function} [config.template=ButtonGroup.TEMPLATE] Template to create
    the button group from.
@return Node
@static
**/
ButtonGroup.createNode = function (config) {
    config = config || {};
    var template = config.template || ButtonGroup.TEMPLATE;

    return Y.Node.create(template(config)).plug(ButtonGroup, {
        type: config.type,
        buttons: config.buttons
    });
};

Y.extend(ButtonGroup, Y.Lite.Widget, {

    /**
    @method _uiRadioClick
    @private
    **/
    _uiRadioClick: function (e) {
        e.preventDefault();

        var targetNode = e.currentTarget,
            targetButton = e.currentTarget.button,
            index,
            selection;

        this.getButtons().each(function (node, i) {
            if (node !== targetNode) {
                node.button.unselect();
            } else {
                index = i;
            }
        });

        if (this._allowNone) {
            targetButton.toggle();
            if (targetButton.isSelected()) {
                selection = {
                    button: targetNode,
                    index: index
                };
            }
        } else if (!targetButton.isSelected()) {
            targetButton.select();
        }

        /**
        Fires when a button in the button group is selected or unselected

        @event selectionChange
        @param {Object} facade An object simulating an event facade
          @param {Object|Array} facade.selection An object or an array of
            objects with two properties: `button` pointing to the button
            node and `index` with the relative index of the button node in
            the collection.
        **/
        this.fire('selectionChange', {
            selection: selection
        });
    },

    /**
    @method _uiCheckboxClick
    @private
    **/
    _uiCheckboxClick: function (e) {
        e.preventDefault();

        var selection = [];

        e.target.button.toggle();
        this.getButtons().each(function (node, i) {
            if (node.button.isSelected()) {
                selection.push({
                    button: node,
                    index: i
                });
            }
        });

        this.fire('selectionChange', {
            selection: selection
        });
    },

    initializer: function (config) {
        var buttons = config.buttons || [],
            boundingBox = this.boundingBox,
            type = config.type || boundingBox.getData('type');

        this._type = type;
        this._allowNone = config.allowNone || boundingBox.getData('allow-none');

        this.getButtons().each(function (node, i) {
            var buttonType = (buttons[i] && buttons[i].type) || type;
            node.plug(!buttonType ? Y.Lite.Button : Y.Lite.ToggleButton, {
                type: buttonType,
                autoToggle: false,
                selected: buttons[i] && buttons[i].selected
            });
        });
    },

    bindUI: function () {
        if (this._type) {
            this._handle = this.contentBox.delegate(
                'click',
                this._type === 'radio' ? this._uiRadioClick : this._uiCheckboxClick,
                ButtonGroup.BUTTON_SELECTOR,
                this
            );
        }
    },

    destructor: function () {
        this.getButtons().destroy();
        
        if (this._handle) {
            this._handle.detach();
            this._handle = null;
        }
    },

    /**
    Returns a node list with all buttons inside this button group

    @method getButtons
    @return NodeList
    **/
    getButtons: function () {
        return this.contentBox.all(ButtonGroup.BUTTON_SELECTOR);
    },

    /**
    Returns a node list with all currently selected buttons

    @method getSelectedButtons
    @return NodeList
    **/
    getSelectedButtons: function () {
        var buttons = [];

        this.getButtons().each(function (node) {
            if (node.button.isSelected()) {
                buttons.push(node);
            }
        });

        return Y.all(buttons);
    },

    /**
    Returns an array of values from the `value` attribute of the child buttons
    or the button text if a `value` attribute is not present.

    @method getSelectedValues
    qreturn String[]
    **/
    getSelectedValues: function () {
        var values = [];

        this.getButtons().each(function (node) {
            if (node.button.isSelected()) {
                values.push(node.get('value') || node.get('text'));
            }
        });

        return values;
    }

});

Y.Lite.ButtonGroup = ButtonGroup;