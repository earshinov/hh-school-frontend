var CalendarUtils = {

	/* день, с которого начинается неделя - понедельник */
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

	/* Получить страницу календаря - список дней, сгруппированный по неделям, для конкретного месяца
	   date - Дата, из которой используются только месяц и год
	   result - Массив дней, сгруппированный по неделям */
	getCalendarPage: function(date) {
		var days = [];
		var weeks = [days];

		date = new Date(date.getFullYear(), date.getMonth(), 1);

		if (date.getDay() !== this.START_DAY) {
			/* переход к последнему дню предыдущего месяца */
			date.setDate(0);

			/* переход к началу последней недели предыдущего месяца */
			var diff = date.getDay() - this.START_DAY;
			if (diff < 0)
				diff += 7;
			date.setDate(date.getDate() - diff);

			/* даты предыдущего месяца */
			while (date.getDate() !== 1) {
				days.push(Dates.clone(date));
				date.setDate(date.getDate() + 1);
			}
		}

		/* даты текущего месяца */
		var month = date.getMonth();
		while (date.getMonth() === month) {
			if (date.getDay() === this.START_DAY) {
				days = [];
				weeks.push(days);
			}
			days.push(Dates.clone(date));
			date.setDate(date.getDate() + 1);
		}

		/* даты следующего месяца */
		while (date.getDay() !== this.START_DAY) {
			days.push(Dates.clone(date));
			date.setDate(date.getDate() + 1);
		}

		return weeks;
	}
};
