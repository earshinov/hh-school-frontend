var App = {

	/* День, с которого начинается неделя - понедельник */
	START_DAY: 1,

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

	DAY_NAMES: [
		"Воскресенье",
		"Понедельник",
		"Вторник",
		"Среда",
		"Четверг",
		"Пятница",
		"Суббота"
	],

	/* Показать указанный месяц
	   date - Дата
	          Используются только год и месяц
	*/
	showMonth: function(date) {
		var self = this;

		$("#calendar-month").text(this.MONTH_NAMES[date.getMonth()] + " " + date.getFullYear());

		var table = $("#calendar-table");
		table.empty();

		var row = null;
		var firstRow;
		this._forEachDay(date, function(date, flag) {
			if (date.getDay() === self.START_DAY) {
				firstRow = (row == null);
				row = $("<tr/>").appendTo(table);
			}

			var cell = $("<td/>").appendTo(row);
			cell.text(date.getDate());
			if (firstRow)
				cell.text(self.DAY_NAMES[date.getDay()] + ", " + cell.text());

			if (flag !== 0)
				cell.addClass("other-month");
		});
	},

	/* Перебор дней календаря для указанного месяца */
	_forEachDay: function(date, f) {
		date = new Date(date.valueOf());
		date.setDate(1);

		if (date.getDay() !== this.START_DAY) {
			/* переходим к предыдущему месяцу */
			date.setDate(0);

			var diff = date.getDay() - this.START_DAY;
			if (diff < 0)
				diff += 7;
			date.setDate(date.getDate() - diff);

			/* перебираем даты предыдущего месяца */
			while (date.getDate() !== 1) {
				f(date, -1);
				date.setDate(date.getDate() + 1);
			}
		}

		/* перебираем даты текущего месяца */
		var month = date.getMonth();
		while (date.getMonth() === month) {
			f(date, 0);
			date.setDate(date.getDate() + 1);
		}

		/* перебираем даты следующего месяца */
		while (date.getDay() !== this.START_DAY) {
			f(date, 1);
			date.setDate(date.getDate() + 1);
		}
	}
}


$( function() {
	App.showMonth(new Date());
	App.selectDay(new Date());
});
