YUI.add('button-lite-tests', function (Y) {

    var Assert = Y.Assert;
    
    //-------------------------------------------------------------------------
    // Base Test Suite
    //-------------------------------------------------------------------------
    
    var suite = new Y.Test.Suite("Button Lite");
    
    var simple = Y.one('#simple').plug(Y.Lite.Button),
        toggler = Y.one('#toggler').plug(Y.Lite.ToggleButton);

    //-------------------------------------------------------------------------
    // Test Case for basic plugin behavior
    //-------------------------------------------------------------------------
    
    suite.add(new Y.Test.Case({
    
        name : "Button Lite basic behavior test",

        //---------------------------------------------------------------------
        // Tests
        //---------------------------------------------------------------------

        'plugin should be plugged': function () {
            Assert.isTrue(!!simple.hasPlugin(Y.Lite.Button.NS), 'plugin should be plugged');
        },

        'plugin content box should be equal to bounding box': function () {
            Assert.areSame(simple.contentBox, simple.boundingBox, 'plugin contentBox should be equal to boundingBox');
        },

        'plugin should normalize class names': function () {
            Assert.isTrue(simple.hasClass('yui3-button'), 'bounding box should have a "yui3-button" class');
            Assert.isTrue(simple.hasClass('yui3-button-content'), 'content box should have a "yui3-button-content" class');
        },

        'enable/disable behavior': function () {
            simple.button.disable();
            Assert.isTrue(simple.hasClass('yui3-button-disabled'), 'disabled button has yui3-button-disabled class');
            Assert.isTrue(simple.get('disabled'), 'disabled button should be disabled by HTML');

            simple.button.enable();
            Assert.isFalse(simple.hasClass('yui3-button-disabled'), 'enabled button should not have a yui3-button-disabled class');
            Assert.isFalse(simple.get('disabled'), 'enabled button should not be disabled by HTML');
        }

    }));

    //-------------------------------------------------------------------------
    // Test Case for ToggleButton
    //-------------------------------------------------------------------------
    
    suite.add(new Y.Test.Case({
    
        name : "ToggleButton Lite basic behavior test",

        //---------------------------------------------------------------------
        // Tests
        //---------------------------------------------------------------------

        'plugin should be plugged': function () {
            Assert.isTrue(!!toggler.hasPlugin(Y.Lite.ToggleButton.NS), 'plugin should be plugged');
        },

        'select/unselect behavior': function () {
            toggler.button.select();
            Assert.isTrue(toggler.hasClass('yui3-button-selected'), 'selected button has yui3-button-selected class');
            Assert.isTrue(toggler.button.isSelected(), 'isSelected() should return true when selected');

            toggler.button.unselect();
            Assert.isFalse(toggler.hasClass('yui3-button-selected'), 'selected button does not have yui3-button-selected class');
            Assert.isFalse(toggler.button.isSelected(), 'isSelected() should return false when unselected');
        },

        'toggle should change class names': function () {
            toggler.button.select().toggle();
            Assert.isFalse(toggler.button.isSelected(), 'isSelected() should return false after toggle() after select()');

            toggler.button.toggle();
            Assert.isTrue(toggler.button.isSelected(), 'isSelected() should return true here');

            toggler.button.toggle(true);
            Assert.isTrue(toggler.button.isSelected(), 'forcing the toggle with true should keep it selected');

            toggler.button.toggle(false);
            Assert.isFalse(toggler.button.isSelected(), 'forcing the toggle with false should unselect it');
        }

    }));

    Y.Test.Runner.add(suite);

}, '0.0.1', {requires: ['button-lite', 'test']});