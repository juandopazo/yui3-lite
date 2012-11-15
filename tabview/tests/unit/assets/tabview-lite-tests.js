YUI.add('tabview-lite-tests', function (Y) {

    var Assert          = Y.Assert;
    
    //-------------------------------------------------------------------------
    // Base Test Suite
    //-------------------------------------------------------------------------
    
    var suite = new Y.Test.Suite("TabView Lite");
    
    var node = Y.one('#test').plug(Y.Lite.TabView),
        list = node.all('li');

    //-------------------------------------------------------------------------
    // Test Case for basic plugin behavior
    //-------------------------------------------------------------------------
    
    suite.add(new Y.Test.Case({
    
        name : "TabView Lite basic behavior test",

        //---------------------------------------------------------------------
        // Tests
        //---------------------------------------------------------------------

        'plugin should be plugged': function () {
            Assert.isTrue(!!node.hasPlugin('tabview'), 'plugin should be plugged');
            list.each(function (li) {
                Assert.isTrue(!!li.hasPlugin('tab'), 'list items should be all plugged with Y.Lite.Tab');
            });
        },

        'plugin should have listNode and panelNode properties': function () {
            Assert.isTrue(!!node.tabview.listNode, 'plugin should have a bounding box');
            Assert.isTrue(!!node.tabview.panelNode, 'plugin should have a content box');
            Assert.isTrue(node.tabview.listNode instanceof Y.Node, 'bounding box should be a Y.Node');
            Assert.isTrue(node.tabview.panelNode instanceof Y.Node, 'content box should be a Y.Node');
        },

        'plugin should normalize class names': function () {
            Assert.isTrue(node.hasClass('yui3-tabview'), 'tabview bounding box should have a "yui3-tabview" class');
            Assert.isTrue(node.tabview.contentBox.hasClass('yui3-tabview-content'), 'tabview content box should have a "yui3-tabview-content" class');
            
            list.each(function (li) {
                Assert.isTrue(li.hasClass('yui3-tab'), 'tab bounding box should have a "yui3-tab" class');
                Assert.isTrue(li.tab.contentBox.hasClass('yui3-tab-content'), 'tab content box should have a "yui3-tab-content" class');
                Assert.isTrue(li.tab.contentBox.hasClass('yui3-tab-label'), 'tab content box should have a "yui3-tab-content" class');
            });
        },

        'plugin should add ARIA roles': function () {
            list.each(function (li) {
                Assert.areEqual(li.get('role'), 'presentation', 'tab bounding box should have "presentation" role');
                Assert.areEqual(li.tab.contentBox.get('role'), 'tab', 'tab content box should have "tab" role');
                Assert.areEqual(li.tab.panelNode.get('role'), 'tabpanel', 'tab panel node should have "tabpanel" role');
                Assert.areEqual(li.tab.panelNode.get('aria-labelledby'), li.tab.contentBox.get('id'), 'tab panel node "aria-labelledby" attribute should point to content box id');
            });
        },

        'clicking on a tab should change the active tab': function () {
            Assert.isTrue(list.item(0).tab.isSelected(), 'first tab should be selected at first');

            list.item(1).tab.contentBox.simulate('click');

            Assert.isTrue(list.item(1).tab.isSelected(), 'second tab should be selected after click');
            Assert.isFalse(list.item(0).tab.isSelected(), 'previous tab should not be selected after click');
        },

        'unplug should remove all internal references': function () {
            var plugin = node.tabview,
                listNodeId = plugin.listNode.get('id'),
                panelNodeId = plugin.panelNode.get('id'),
                tabPlugins = Y.Array.map(list._nodes, function (li) { return Y.one(li).tab; }),
                tabPanelIds = Y.Array.map(list._nodes, function (li) { return Y.one(li).tab.panelNode.get('id'); });

            node.unplug(Y.Lite.TabView);

            Assert.isNull(plugin.listNode, 'plugin list node should not point to node');
            Assert.isNull(plugin.panelNode, 'plugin panel node should not point to a node');
            Assert.isUndefined(Y.Node._instances[listNodeId], 'list node should not be cached by Y.Node anymore');
            Assert.isUndefined(Y.Node._instances[panelNodeId], 'panel node should not be cached by Y.Node anymore');

            Y.Array.each(tabPlugins, function (tabplug) {
                Assert.isNull(tabplug.panelNode, 'tab plugin should not have a panel node');
            });
            Y.Array.each(tabPanelIds, function (id) {
                Assert.isUndefined(Y.Node._instances[id], 'tab panel node should not be cached by Y.Node anymore');
            });
        }

    }));

    Y.Test.Runner.add(suite);

}, '0.0.1', {requires: ['tabview-lite', 'array-extras', 'node-event-simulate', 'test']});