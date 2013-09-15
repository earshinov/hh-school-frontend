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


/* Вспомогательные функции для работы с датами */
var Dates = {

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
	}
};
