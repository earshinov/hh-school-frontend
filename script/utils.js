var inherit = function() {
	function F() { }
	return function( child, parent ) {
		F.prototype = parent.prototype;
		child.prototype = new F();
		child.prototype.constructor = child;
		child.base = parent.prototype;
		return child;
	};
}();


function htmlEncode(s) {
	return s ? s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : s;
}


if (!String.prototype.startsWith)
  	String.prototype.startsWith = function(searchString, position) {
		position = position || 0;
		return this.indexOf(searchString, position) === position;
	};

if (!String.prototype.trim)
	String.prototype.trim = function() {
		return this.replace(/^\s+/, '').replace('\s+$', '');
	};

if (!String.prototype.trimLeft)
	String.prototype.trimLeft = function() {
		return this.replace(/^\s+/, '');
	};


var Utils = {

	/* Разбиение строки по разделителю с игнорированием пустых строк в получившемся массиве */
	split: function(s, separator) {
		var ret = [];
		var a = s.split(separator);
		for (var i = 0; i < a.length; i++) {
			s = a[i].trim();
			if (s)
				ret.push(s);
		}
		return ret;
	}
}


/* Вспомогательные функции для работы с датами */
var Dates = {

	MONTH_NAMES: [
		"Январь",
		"Февраль",
		"Март",
		"Апрель",
		"Май",
		"Июнь",
		"Июль",
		"Август",
		"Сентябрь",
		"Октябрь",
		"Ноябрь",
		"Декабрь"
	],

	MONTH_NAMES_2: [
		"января",
		"февраля",
		"марта",
		"апреля",
		"мая",
		"июня",
		"июля",
		"августа",
		"сентября",
		"октября",
		"ноября",
		"декабря"
	],

	DAY_NAMES: [
		"Воскресенье",
		"Понедельник",
		"Вторник",
		"Среда",
		"Четверг",
		"Пятница",
		"Суббота"
	],

	MILLISECONDS_PER_DAY: 1000 * 3600 * 24,

	/* Получить название месяца
	   month - номер месяца в нумерации JavaScript (0..11) */
	getMonthName: function(month) {
		return this.MONTH_NAMES[month];
	},

	/* Получить название дня недели
	   day - номер дня недели в нумерации JavaScript (0 - воскресенье) */
	getDayName: function(day) {
		return this.DAY_NAMES[day];
	},

	clone: function(date) {
		return new Date(date.valueOf());
	},

	prevMonth: function(date) {
		date = this.clone(date);
		if (date.getMonth() == 0) {
			date.setYear(date.getFullYear() - 1);
			date.setMonth(11);
		}
		else
			date.setMonth(date.getMonth() - 1);
		return date;
	},

	nextMonth: function(date) {
		date = this.clone(date);
		if (date.getMonth() == 11) {
			date.setYear(date.getFullYear() + 1);
			date.setMonth(0);
		}
		else
			date.setMonth(date.getMonth() + 1);
		return date;
	},

	format: function(date) {
		return date.getDate() + " " + this.MONTH_NAMES_2[date.getMonth()] + " " + date.getFullYear();
	},

	parse: function(s) {
		s = s.trim();
		if (!s)
			return null;

		var m = /^\d+\s*/.exec(s);
		if (!m)
			return null;

		var day = parseInt(m[0], 10);
		s = s.substring(m.index + m[0].length);

		var month = -1;
		$.each(this.MONTH_NAMES_2, function(i) {
			if (s.startsWith(this)) {
				month = i;
				s = s.substring(this.length).trimLeft();
				return false;
			}
		});
		if (month === -1)
			return null;

		var year;
		if (!s)
			year = new Date().getFullYear();
		else {
			m = /^\d+$/.exec(s);
			if (!m)
				return null;
			year = parseInt(m[0], 10);
		}

		var date;
		try {
			date = new Date(year, month, day);
		}
		catch(e) {
			return null;
		}

		if (date.getDate() !== day ||
			date.getMonth() !== month ||
			date.getFullYear() !== year)
			return null;

		return date;
	}
};
