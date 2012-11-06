/**
The TabView Plugin is a lightweight implementation of the TabView widget
meant to be used without interaction with other components and only
from existing markup.

To use the TabView Plugin simply pass a reference to the plugin to a
Node or NodeList instance's `plug` method.

```
YUI().use('tabview-plugin', function (Y) {
    
    Y.all('.yui3-tabview').plug(Y.Lite.TabView);

});
```

You can configure the event used to activate tabs by passing the plugin
a configuration object with a `triggerEvent` property

```
Y.one('.yui3-tabview').plug(Y.Lite.TabView, {
    triggerEvent: 'mouseover'
});
```

@module tabview-plugin
**/

var Lite = Y.Lite,
    getClassName = Y.ClassNameManager.getClassName;

/**
A tab is an element of a list with an anchor and a related panel.
`Lite.Tab` provides ARIA support, normalizes class names and
drives the basic functionality of a Tab.

@class Lite.Tab
@extends Lite.Widget
@param config {Object} Object literal specifying configuration properties.
**/
function Tab() {
    Tab.superclass.constructor.apply(this, arguments);
}

/**
@property NS
@type String
@value tab
@static
**/
Tab.NS = 'tab';

Tab.CLASS_NAMES = {
    '> a': 'label'
};

Y.extend(Tab, Lite.Widget, {

    /**
    @property SELECTED_CLASS
    @type String
    **/
    SELECTED_CLASS: getClassName(Tab.NS, 'selected'),

    /**
    @method _initAria
    @protected
    **/
    _initAria: function () {
        var contentBox = this.contentBox,
            id = contentBox.get('id');

        if (!id) {
            id = Y.guid();
            contentBox.set('id', id);
        }

        this.boundingBox.set('role', 'presentation');
        contentBox.set('role', 'tab');
        this.panelNode.setAttrs({
            role: 'tabpanel',
            'aria-labelledby': id
        });
    },

    /**
    @method _toggleSelected
    @param {Boolean} selected
    @private
    **/
    _toggleSelected: function (selected) {
        this.boundingBox.toggleClass(this.SELECTED_CLASS, selected);
        this.panelNode.toggleClass(this.getClassName('panel', 'selected'), selected);
    },

    /**
    @method _uiSelectTab
    @param {EventFacade} event
    @private
    **/
    _uiSelectTab: function (e) {
        e.preventDefault();
        this.select();
    },

    initializer: function (config) {
        this.panelNode = config.panelNode;
        this._triggerEvent = config.triggerEvent || 'click';
    },

    renderUI: function () {
        this.panelNode.addClass(this.getClassName('panel'));

        this._initAria();
    },

    bindUI: function () {
        this._handles.push(
            this.boundingBox.on(this._triggerEvent, this._uiSelectTab, this)
        );
    },

    syncUI: function () {
        if (this.boundingBox.hasClass(this.SELECTED_CLASS)) {
            this.select();
        }
    },

    destructor: function () {
        this.panelNode.destroy();
        this.panelNode = null;
    },

    /**
    @method select
    @chainable
    **/
    select: function () {
        // Deselect the previously selected class
        var previous = this.boundingBox.get('parentNode').one('.' + this.SELECTED_CLASS);
        if (previous) {
            previous.tab.unselect();
        }

        this._toggleSelected(true);

        return this;
    },

    /**
    @method unselect
    @chainable
    **/
    unselect: function () {
        this._toggleSelected(false);

        return this;
    },

    /**
    @method isSelected
    @return Boolean
    **/
    isSelected: function () {
        return this.boundingBox.hasClass(this.SELECTED_CLASS);
    }

});

Lite.Tab = Tab;