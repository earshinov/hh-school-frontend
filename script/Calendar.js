function Calendar(storage, $table, $monthName, $cellTemplate, $eventTemplate) {
	this.storage = storage;
	this.table = $table;
	this.monthName = $monthName;
	this.cellTemplate = $cellTemplate.html();
	this.eventTemplate = $eventTemplate.html();

	this.month = null; /* месяц, выбранный в календаре */
	this.firstDate = null; /* первая дата на странице календаря */
	this.lastDate = null; /* последняя дата на странице календаря */

	this.table.delegate(".add-event-button", "click", function() {
		$(this).trigger("event-add", { date: $(this).parents("td:first").data("date") });
	});
	this.table.delegate(".event", "click", function() {
		$(this).trigger("event-edit", { event: $(this).data("event") });
	});
}

/* Установить календарь на указанный месяц
   date - Дата, из которой используются только месяц и год */
Calendar.prototype.setMonth = function(date) {
	var calendar = this;
	calendar.table.empty();

	var weeks = CalendarUtils.getCalendarPage(date);

	var today = new Date();
	var todayTimestamp = new Date(today.getFullYear(), today.getMonth(), today.getDate()).valueOf();

	/* заполнение страницы календаря */

	var firstRow = true;
	$.each(weeks, function() {
		var row = $("<tr/>").appendTo(calendar.table);
		$.each(this, function() {

			var text = this.getDate();
			if (firstRow)
				text = Dates.getDayName(this.getDay()) + ", " + text;

			var cell = calendar._renderCell(text);
			cell.data("date", this);
			cell.appendTo(row);
			if (this.valueOf() == todayTimestamp)
				cell.addClass("today");

			calendar.updateCell(this, cell);
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

Calendar.prototype.updateCell = function(date, cell) {
	if (cell === undefined) {
		cell = this.cellByDate(date);
		if (cell == null)
			return;
	}

	var calendar = this;

	var $events = cell.find(".events");
	$events.empty();

	var events = this.storage.getEventsForDay(date);
	cell.toggleClass("with-events", events.length > 0);
	$.each(events, function() {
		var event = calendar._renderEvent(this);
		event.data("event", this);
		event.appendTo($events);
	});
};

Calendar.prototype.cellByDate = function(date) {
	var cell = this.table.find("td").eq((date.valueOf() - this.firstDate.valueOf()) / Dates.MILLISECONDS_PER_DAY);
	return cell.length > 0 ? cell : null;
};

Calendar.prototype._renderCell = function(text) {
	var html = this.cellTemplate;
	html = html.replace("{text}", htmlEncode(text));
	return $(html);
};

Calendar.prototype._renderEvent = function(event) {
	var html = this.eventTemplate;
	html = html.replace("{name}", htmlEncode(event.name));
	html = html.replace("{participants}", htmlEncode(event.participants.join(", ")));
	html = html.replace("{description}", htmlEncode(event.description));
	return $(html).eq(0);
};
