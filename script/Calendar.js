function Calendar($monthName, $table) {
	this.monthName = $monthName;
	this.table = $table;

	this.month = null; /* месяц, выбранный в календаре */
}

/* Установить календарь на указанный месяц
   date - Дата, из которой используются только месяц и год */
Calendar.prototype.setMonth = function(date) {
	var calendar = this;
	calendar.table.empty();

	var weeks = CalendarUtils.getCalendarPage(date);
	var firstRow = true;
	$.each(weeks, function() {
		var row = $("<tr/>").appendTo(calendar.table);
		$.each(this, function() {
			var cell = $("<td/>").appendTo(row);

			cell.text(this.getDate());
			if (firstRow)
				cell.text(CalendarUtils.getDayName(this.getDay()) + ", " + cell.text());
		});
		firstRow = false;
	});

	this.month = new Date(date.getFullYear(), date.getMonth(), 1);
	this.monthName.text(CalendarUtils.getMonthName(this.month.getMonth()) + " " + this.month.getFullYear());
};
