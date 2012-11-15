YUI.add('buttongroup-tests', function (Y) {

    var group1Node = Y.one('#group1').plug(Y.Lite.ButtonGroup);
    var group2Node = Y.one('#group2').plug(Y.Lite.ButtonGroup, {
        allowNone: true
    });
    var group3Node = Y.one('#group3').plug(Y.Lite.ButtonGroup);
    var group1 = group1Node.buttongroup;
    var group2 = group2Node.buttongroup;
    var group3 = group2Node.buttongroup;

    var group4Node = Y.Lite.ButtonGroup.createNode({
        type: 'radio',
        buttons: [{
            label: 'foo',
            selected: true
        }, {
            label: 'bar'
        }]
    }).appendTo('body');
    var group4 = group4Node.buttongroup;

    var Assert = Y.Assert;
    var ArrayAssert = Y.Test.ArrayAssert;
    
    //-------------------------------------------------------------------------
    // Base Test Suite
    //-------------------------------------------------------------------------
    
    var suite = new Y.Test.Suite("Button Group Lite");
    
    suite.add(new Y.Test.Case({
    
        name : "Button Group Lite basic behavior test",

        //---------------------------------------------------------------------
        // Tests
        //---------------------------------------------------------------------

        'plugin should be plugged': function () {
            Assert.isTrue(!!group1Node.hasPlugin(Y.Lite.ButtonGroup.NS), 'plugin should be plugged');
        },

        'plugin should normalize class names': function () {
            Assert.isTrue(group1.boundingBox.hasClass('yui3-buttongroup'), 'bounding box should have a "yui3-buttongroup" class');
            Assert.isTrue(group1.contentBox.hasClass('yui3-buttongroup-content'), 'content box should have a "yui3-buttongroup-content" class');
        },

        'getButtons() should return all buttons': function () {
            ArrayAssert.itemsAreSame(group1.getButtons()._nodes, group1.contentBox.all('button')._nodes, 'getButtons() should return all buttons');
        },

        'getSelectedButtons() should return the selected buttons': function () {
            ArrayAssert.itemsAreSame(group1.getSelectedButtons()._nodes, [], 'at first no buttons should be selected');

            group1.getButtons().item(2).simulate('click');
            ArrayAssert.itemsAreSame(group1.getSelectedButtons()._nodes, [group1.getButtons().item(2)._node], 'only the third button should be selected after click');
        },

        'getSelectedValues() should return the selected button values': function () {
            ArrayAssert.itemsAreSame(group1.getSelectedValues(), [group1.getButtons().item(2).get('text')], 'should return only the text in the third button');

            group1.getButtons().item(0).simulate('click');
            ArrayAssert.itemsAreSame(group1.getSelectedValues(), [group1.getButtons().item(0).get('text')], 'should return only the first button value');
        }

    }));

    suite.add(new Y.Test.Case({
    
        name : "Button Group Lite radio allow none test",

        //---------------------------------------------------------------------
        // Tests
        //---------------------------------------------------------------------

        'plugin should allow no buttons to be selected': function () {
            group2.getButtons().item(2).simulate('click');
            ArrayAssert.itemsAreSame(group2.getSelectedButtons()._nodes, [group2.getButtons().item(2)._node], 'selected after click should match');

            group2.getButtons().item(2).simulate('click');
            ArrayAssert.itemsAreSame(group2.getSelectedButtons()._nodes, [], 'selected after second click should be empty');
        }

    }));

    suite.add(new Y.Test.Case({
    
        name : "Button Group Lite checkbox test",

        //---------------------------------------------------------------------
        // Tests
        //---------------------------------------------------------------------

        'plugin should allow no buttons to be selected': function () {
            group3.getButtons().item(2).simulate('click');
            ArrayAssert.itemsAreSame(group3.getSelectedButtons()._nodes, [group3.getButtons().item(2)._node], 'selected after click should match');

            group3.getButtons().item(2).simulate('click');
            ArrayAssert.itemsAreSame(group3.getSelectedButtons()._nodes, [], 'selected after second click should be empty');
        }

    }));


    Y.Test.Runner.add(suite);


}, '0.0.1', {requires: ['buttongroup-lite', 'test', 'node-event-simulate']});