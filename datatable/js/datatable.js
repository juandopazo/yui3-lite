function DataTableLite() {
	DataTableLite.superclass.constructor.apply(this, arguments);
}
Y.extend(DataTableLite, Y.Plugin.Widget, {

	SORT_INDICATOR_TEMPLATE: '<div class="yui3-datatable-sort-liner">{text}<span class="yui3-datatable-sort-indicator"></span></div>',

	_toColumnKey: function (str) {
		return str.toLowerCase().replace(/\s/g, '-');
	},

	_getColumnData: function () {
		var columns = [],
			sortableClass = this.getClassName('sortable', 'column');

		this.thead.all('th').each(function (th) {
			var key = this._toColumnKey(th.get('text'));
			columns.push({
				key: key,
				sortable: th.hasClass(sortableClass),
				className: this.getClassName('col', key)
			});
		}, this);

		return columns;
	},

	_getDataFromMarkup: function () {
		var rows = this.tbody.all('tr'),
			columns = this.columns,
			data = [];

		rows.each(function (tr) {
			var id = tr.get('id'),
				row = {};

			if (!id) {
				id = Y.guid();
				tr.set('id', id);
			}
			row.__id__ = id;

			tr.all('td').each(function (td, i) {
				row[columns[i].key] = td.get('text');
			});
			data.push(row);
		});

		return data;
	},

	_renderTableClassNames: function () {
		var columns = this.columns,
			cellClassName = this.getClassName('cell');

		function addColumnClass(td, i) {
			td.addClass(columns[i].className);
		}

		this.table.addClass(this.getClassName('table'));
		this.caption.addClass(this.getClassName('caption'));

		this.thead
			.addClass(this.getClassName('columns'))
			.all('th').addClass(this.getClassName('header'))
			.each(function (th, i) {
				th.addClass(columns[i].className)
					.setData('key', columns[i].key);
			})
			.item(0).addClass(this.getClassName('first', 'header'));

		this.tbody
			.addClass(this.getClassName('data'))
			.all('tr').each(function (tr) {
				tr.all('td').addClass(cellClassName).each(addColumnClass);
			});
	},

	_renderSortableHeaders: function () {
		var self = this,
			columns = this.columns,
			sortableClass = this.getClassName('sortable', 'column'),
			linerClass = this.getClassName('sort', 'liner');

		this.thead.all('th').each(function (th, i) {
			if (columns[i].sortable) {
				th.addClass(sortableClass).setData('key', columns[i].key);

				if (!th.one('.' + linerClass)) {
					th.setHTML(Y.Lang.sub(self.SORT_INDICATOR_TEMPLATE, {
						text: th.get('text')
					}));
				}
			}
		});
	},

	_syncRowClasses: function () {
		var evenClass = this.getClassName('even'),
			oddClass = this.getClassName('odd');

		this.tbody.all('tr').each(function (tr, i) {
			tr.removeClass(i % 2 === 0 ? oddClass : evenClass)
				.addClass(i % 2 === 0 ? evenClass : oddClass);
		});
	},

	_onSortableThClick: function (e) {
		var target = e.target,
			th = target.get('nodeName') === 'TH' ? target : target.ancestor('th');

		this.sortBy(th.getData('key'), !th.getData('asc'));
	},

	_syncOrder: function () {
		var tbody = this.tbody.getDOMNode(),
			data = this._data,
			doc = Y.config.doc,
			i = 0, length = data.length;

		for (; i < length; i++) {
			tbody.appendChild(doc.getElementById(data[i].__id__));
		}
	},

	_getColumnIndex: function (key) {
		var columns = this.columns,
			i = 0, length = columns.length;

		for (; i < length; i++) {
			if (columns[i].key === key) {
				return i;
			}
		}
		return -1;
	},

	_syncHeaderSort: function (index, asc) {
		var sorted = this.getClassName('sorted'),
			sortedAsc = this.getClassName('sorted', 'asc');
			sortedDesc = this.getClassName('sorted', 'desc');

		this.thead
			.all('th')
			.removeClass(sorted).removeClass(sortedAsc).removeClass(sortedDesc)
			.item(index)
			.setData('asc', asc)
			.addClass(sorted).addClass(asc ? sortedAsc : sortedDesc);
	},

	_syncBodySort: function (index) {
		var tbody = this.tbody,
			sorted = this.getClassName('sorted');

		tbody.all('td').removeClass(sorted);
		tbody.all('td:nth-child(' + (index + 1) + ')').addClass(sorted);
	},

	init: function (config) {
		var contentBox = this.contentBox,
			table = contentBox.one('> table'),
			self = this,
			columns;

		this.table = table;
		this.caption = contentBox.one('caption');
		this.thead = table.one('> thead');
		this.tbody = table.one('> tbody');

		if (config.columns) {
			columns = [];
			Y.Array.each(config.columns, function (colDef) {
				var def = typeof colDef !== 'string' ? colDef : {
					key: colDef,
					sortable: false
				};
				def.className = self.getClassName('col', def.key);
				columns.push(def);
			});
		} else {
			columns = this._getColumnData();
		}

		this.columns = columns;
		this._data = config.data || this._getDataFromMarkup();
	},

	renderUI: function () {
		this._renderTableClassNames();
		this._renderSortableHeaders();
	},

	bindUI: function () {
		this.thead.delegate('click', this._onSortableThClick, '.' + this.getClassName('sortable', 'column'), this);
	},

	syncUI: function () {
		this._syncRowClasses();
	},

	toJSON: function () {
		return this._data;
	},

	sortBy: function (col, asc) {
		if (typeof col === 'number') {
			col = this.columns[col].key;
		}

		var index = this._getColumnIndex(col);

		this._data.sort(asc ? function (a, b) {
			return a[col] > b[col];
		} : function (a, b) {
			return a[col] < b[col];
		});

		this._syncHeaderSort(index, asc);
		this._syncBodySort(index);
		this._syncOrder();
		this.syncUI();
	}

}, {
	NS: 'datatable'
});

Y.Plugin.DataTable = DataTableLite;