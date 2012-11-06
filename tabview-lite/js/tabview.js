/**
The Plugin.TabView class is a plugin for a Node instance.  The class is used via
the `plug` method of Node and should not be instantiated directly.

@class Lite.TabView
@extends Lite.Widget
@param config {Object} Object literal specifying configuration properties.
**/
function TabView() {
    TabView.superclass.constructor.apply(this, arguments);
}
Y.extend(TabView, Lite.Widget, {

    initializer: function (config) {
        this._triggerEvent = config.triggerEvent;

        this.listNode = this.contentBox.one('> ul');
        this.panelNode = this.contentBox.one('> div');
    },

    renderUI: function () {
        var panelNode = this.panelNode,
            panels = panelNode.all('> div');

        this.listNode.all('> li').each(function (tabNode, i) {
            tabNode.plug(Lite.Tab, {
                panelNode: panels.item(i),
                triggerEvent: this._triggerEvent
            });
        });
    },

    syncUI: function () {
        var selected = false,
            items = this.listNode.all('> li').each(function (tabNode) {
                if (tabNode.tab.isSelected()) {
                    selected = true;
                }
            });

        if (!selected) {
            items.item(0).tab.select();
        }
    },

    destructor: function () {
        this.listNode.all('> li').destroy();
        this.listNode.destroy();
        this.panelNode.destroy();
        this.listNode = this.panelNode = null;
    }

}, {
    /**
    @property NS
    @value tabview
    @static
    **/
    NS: 'tabview',

    CLASS_NAMES: {
        '> div > ul': 'list',
        '> div > div': 'panel'
    }
});

Lite.TabView = TabView;