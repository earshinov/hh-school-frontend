function Calendar(storage, $table, $monthName, $cellTemplate, $eventTemplate) {
	this.storage = storage;
	this.table = $table;
	this.monthName = $monthName;
	this.cellTemplate = $cellTemplate.html();
	this.eventTemplate = $eventTemplate.html();

	this.month = null; /* месяц, выбранный в календаре */
	this.firstDate = null; /* первая дата на странице календаря */
	this.lastDate = null; /* последняя дата на странице календаря */
}

/* Установить календарь на указанный месяц
   date - Дата, из которой используются только месяц и год */
Calendar.prototype.setMonth = function(date) {
	var calendar = this;
	calendar.table.empty();

	var weeks = CalendarUtils.getCalendarPage(date);

	/* заполнение страницы календаря */
	var firstRow = true;
	$.each(weeks, function() {
		var row = $("<tr/>").appendTo(calendar.table);
		$.each(this, function() {
			var cell = $("<td/>").appendTo(row);
			cell.data("date", this);

			cell.text(this.getDate());
			if (firstRow)
				cell.text(Dates.getDayName(this.getDay()) + ", " + cell.text());

			cell.html(cell.html() + calendar.cellTemplate);

			var events = calendar.storage.getEventsForDay(this);
			if (events.length > 0) {
				var html = "";
				$.each(events, function() {
					html += calendar._renderEventHtml(this);
				});
				cell.find(".events").html(html);
			}
		});
		firstRow = false;
	});

	this.month = new Date(date.getFullYear(), date.getMonth(), 1);
	this.firstDate = weeks[0][0];
	this.lastDate = weeks[weeks.length - 1][6];

	this.monthName.text(Dates.getMonthName(this.month.getMonth()) + " " + this.month.getFullYear());
};

Calendar.prototype.prevMonth = function() {
	if (this.month == null)
		throw "Календарь не проинициализирован";
	this.setMonth(Dates.prevMonth(this.month));
};

Calendar.prototype.nextMonth = function() {
	if (this.month == null)
		throw "Календарь не проинициализирован";
	this.setMonth(Dates.nextMonth(this.month));
};

Calendar.prototype.addEvent = function(event) {
	var cell = this.cellByDate(event.date);
	if (!cell)
		return;

	var $events = cell.find(".events");
	$events.html($events.html() + this._renderEventHtml(event));
};

Calendar.prototype._renderEventHtml = function(event) {
	var html = this.eventTemplate;
	html = html.replace("{name}", htmlEncode(event.name));
	html = html.replace("{participants}", htmlEncode(event.participants.join(", ")));
	html = html.replace("{description}", htmlEncode(event.description));
	return html;
};

Calendar.prototype.cellByDate = function(date) {
	var cell = this.table.find("td").eq((date.valueOf() - this.firstDate.valueOf()) / Dates.MILLISECONDS_PER_DAY);
	return cell.length > 0 ? cell : null;
};

Calendar.prototype.dateByCell = function(cell) {
	return cell.data("date");
};
