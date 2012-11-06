var getClassName = Y.ClassNameManager.getClassName,
    slice = Array.prototype.slice;

/**
A lighweight base class for developing simple plugins that behave like widgets.

@class Lite.Widget
@param config {Object} Object literal specifying configuration properties.
**/
function WidgetLite(config) {
    WidgetLite.superclass.constructor.apply(this, arguments);

    config = config || {};

    var superclass = this.constructor,
        host = config.host,
        classes = [];

    this.boundingBox = host;
    this.contentBox = host.one(this.CONTENT_SELECTOR) || host;

    while (superclass && superclass !== WidgetLite.superclass.constructor) {
        classes.push(superclass);
        superclass = superclass.superclass && superclass.superclass.constructor;
    }
    /**
    A list with all the constructors in the prototype chain

    @property _classes
    @type Array
    @private
    **/
    this._classes = classes.reverse();

    this.init(config);
}

/**
@property NS
@type String
@value widget
@static
**/
WidgetLite.NS = 'widget';

/**
@property CLASS_NAMES
@type Object
@static
**/
WidgetLite.CLASS_NAMES = {};

Y.extend(WidgetLite, Y.EventTarget, {

    /**
    A selector that matches the content box of the plugin.
    If set to `null` the `contentBox` property will point to
    the bounding box.

    @property CONTENT_SELECTOR
    @type String
    @protected
    **/
    CONTENT_SELECTOR: '> *',

    /**
    Normalizes class names according to what Y.Widget does
    It loops over the prototype chain and adds classes like yui3-{ns} to the
    bounding box and yui3-{ns}-content to the content box where {ns}
    is the namespace of the plugin (its NS property).
    It also adds classes based on the CLASS_NAMES static property
    (see [CLASS_NAMES](#property_CLASS_NAMES)).

    @method _renderClassNames
    @private
    **/
    _renderClassNames: function () {
        var self = this,
            boundingBox = this.boundingBox;

        function addClassByName(className) {
            this.addClass(self.getClassName(className));
        }

        function addClassesFromOptions(classNames, selector) {
            var nodes = boundingBox.all(selector);
            if (Y.Lang.isArray(classNames)) {
                Y.Array.each(classNames, addClassByName, nodes);
            } else {
                addClassByName.call(nodes, classNames);
            }
        }

        this.contentBox.addClass(this.getClassName('content'));

        Y.Array.each(this._classes, function (_class) {
            boundingBox.addClass(getClassName(_class.NS));
            Y.Object.each(_class.CLASS_NAMES, addClassesFromOptions);
        });
    },

    /**
    Returns a normalized class name based on Y.ClassNameManager.
    Takes any number of string arguments.

    @method getClassName
    @param {String} classes*
    @return String
    **/
    getClassName: function () {
        return getClassName.apply(Y.ClassNameManager, [this.constructor.NS].concat(slice.call(arguments)));
    },

    /**
    @method init
    @private
    **/
    init: function (config) {
        var self = this;

        /**
        A list of event handles attached during the lifetime of the
        plugin. All this handles get detached when the plugin is detached.
        You're encouraged to add handles to this list when extending the
        Y.Lite.Widget class.

        @property _handles
        @type Array
        @protected
        **/
        this._handles = [];

        Y.Array.each(this._classes, function (_class) {
            if (_class.prototype.hasOwnProperty('initializer')) {
                _class.prototype.initializer.call(self, config);
            }
        });

        this.render();
    },

    renderUI: function () {},

    bindUI: function () {},

    syncUI: function () {},

    /**
    @method render
    @protected
    @chainable
    **/
    render: function () {
        this._renderClassNames();

        this.renderUI();
        this.bindUI();
        this.syncUI();

        return this;
    },

    /**
    @method destroy
    **/
    destroy: function () {
        var self = this;

        Y.Array.each(this._handles, function (handle) {
            handle.detach();
        });

        Y.Array.each(this._classes, function (_class) {
            if (_class.prototype.hasOwnProperty('destructor')) {
                _class.prototype.destructor.call(self);
            }
        });

        this.contentBox = this.boundingBox = this._classes = this._handles = null;
    }

});

Y.Lite = {
    Widget: WidgetLite
};