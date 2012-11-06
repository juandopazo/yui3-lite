YUI.add('widget-lite-tests', function (Y) {

    var Assert          = Y.Assert,
        ObjectAssert    = Y.ObjectAssert;
    
    //-------------------------------------------------------------------------
    // Base Test Suite
    //-------------------------------------------------------------------------
    
    var suite = new Y.Test.Suite("Widget Lite");
    
    var node = Y.one('#test').plug(Y.Lite.Widget);

    //-------------------------------------------------------------------------
    // Test Case for basic plugin behavior
    //-------------------------------------------------------------------------
    
    suite.add(new Y.Test.Case({
    
        name : "Widget Lite basic behavior test",

        //---------------------------------------------------------------------
        // Tests
        //---------------------------------------------------------------------

        'plugin should be plugged': function () {
            Assert.isTrue(!!node.hasPlugin('widget'), 'plugin should be plugged');
        },

        'plugin should have boundingBox and contentBox properties': function () {
            Assert.isTrue(!!node.widget.boundingBox, 'plugin should have a bounding box');
            Assert.isTrue(!!node.widget.contentBox, 'plugin should have a content box');
            Assert.isTrue(node.widget.boundingBox instanceof Y.Node, 'bounding box should be a Y.Node');
            Assert.isTrue(node.widget.contentBox instanceof Y.Node, 'content box should be a Y.Node');
        },

        'plugin should normalize class names': function () {
            Assert.isTrue(node.hasClass('yui3-widget'), 'bounding box should have a "yui3-widget" class');
            Assert.isTrue(node.widget.contentBox.hasClass('yui3-widget-content'), 'content box should have a "yui3-widget-content" class');
        },

        'unplug should remove all internal references': function () {
            var plugin = node.widget;
            node.unplug(Y.Lite.Widget);

            Assert.isUndefined(node.widget, 'plugin should not be in the node instance');
            Assert.isNull(plugin.boundingBox, 'plugin instance should not point to node');
            Assert.isNull(plugin.contentBox, 'plugin instance content should not point to a node');
        }

    }));

    //-------------------------------------------------------------------------
    // Test Case for inheritcan behavior
    //-------------------------------------------------------------------------

    function SomeWidget() {
        SomeWidget.superclass.constructor.apply(this, arguments);
    }
    SomeWidget.NS = 'some';
    Y.extend(SomeWidget, Y.Lite.Widget, {
        CONTENT_SELECTOR: null,
        initializer: function () {
            this.initialized = true;
        },
        renderUI: function () {
            this.uiRendered = true;
        },
        bindUI: function () {
            this.uiBound = true;
        },
        syncUI: function () {
            this.uiSynced = true;
        },
        destructor: function () {
            this.destroyed = true;
        }
    });

    suite.add(new Y.Test.Case({
    
        name : "Widget Lite inheritance test",

        'initialize tests': function () {
            this._node = Y.one('#no-content').plug(SomeWidget);
        },

        //---------------------------------------------------------------------
        // Tests
        //---------------------------------------------------------------------

        'extended plugin should be plugged': function () {
            Assert.isTrue(!!this._node.hasPlugin('some'), 'extended plugin should be plugged');
        },


        'extended plugin should normalize class names': function () {
            Assert.isTrue(this._node.hasClass('yui3-widget'), 'bounding box should have a "yui3-widget" class');
            Assert.isTrue(this._node.hasClass('yui3-some'), 'bounding box should have a "yui3-some" class');
            Assert.isTrue(this._node.some.contentBox.hasClass('yui3-some-content'), 'content box should have a "yui3-some-content" class');
        },

        'extended plugin should run widget-like methods': function () {
            Assert.isTrue(this._node.some.initialized, 'initializer() should have executed');
            Assert.isTrue(this._node.some.uiRendered, 'renderUI() should have executed');
            Assert.isTrue(this._node.some.uiBound, 'bindUI() should have executed');
            Assert.isTrue(this._node.some.uiSynced, 'syncUI() should have executed');
        },

        'CONTENT_SELECTOR null should make content box point to bounding box': function () {
            Assert.areSame(this._node.some.boundingBox, this._node.some.contentBox, 'contentBox should be the same as boundingBox');
        },

        'extended unplug should remove all internal references': function () {
            var plugin = this._node.some;
            this._node.unplug(SomeWidget);

            Assert.isUndefined(this._node.some, 'plugin should not be in the node instance');
            Assert.isNull(plugin.boundingBox, 'plugin instance should not point to node');
            Assert.isNull(plugin.contentBox, 'plugin instance content should not point to a node');
            Assert.isTrue(plugin.destroyed, 'destructor() should have executed');
        }

    }));

    Y.Test.Runner.add(suite);

}, '0.0.1', {requires: ['widget-lite', 'test']});