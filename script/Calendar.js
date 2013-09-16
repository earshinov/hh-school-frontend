/* Calendar - визуальное представление календаря
================================================ */

function Calendar(storage, $table, $monthName, $cellTemplate, $eventTemplate) {
	this.storage = storage;
	this.table = $table;
	this.monthName = $monthName;
	this.cellTemplate = $cellTemplate.html();
	this.eventTemplate = $eventTemplate.html();

	this.month = null; /* месяц, выбранный в календаре */
	this.firstDate = null; /* первая дата на странице календаря */
	this.lastDate = null; /* последняя дата на странице календаря */

	/* Кастомное событие event-add
	   Срабатывает на кнопке добавления нового события (и "всплывает")
	   Вместе с событием передаются параметры:
	     date - дата, для которой добавляется событие (объект даты без времени) */
	this.table.delegate(".add-event-button", "click", function() {
		$(this).trigger("event-add", { date: $(this).parents("td:first").data("date") });
	});

	/* Кастомное событие event-edit
	   Срабатывает при выборе существующего события в календаре
	   на DOM-элементе, соответствующем этому событию (и "всплывает").
	   Вместе с событием передаются параметры:
	     event - редактируемое событие (объект EventData) */
	this.table.delegate(".event", "click", function() {
		$(this).trigger("event-edit", { event: $(this).data("event") });
	});
}

/* Установить календарь на указанный месяц
   date - Дата, из которой используются только месяц и год */
Calendar.prototype.setMonth = function(date) {
	var calendar = this;
	calendar.table.empty();

	var today = new Date();
	var todayTimestamp = new Date(today.getFullYear(), today.getMonth(), today.getDate()).valueOf();

	var weeks = CalendarUtils.getCalendarPage(date);

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

/* Перейти к предыдущему месяцу в календаре */
Calendar.prototype.prevMonth = function() {
	if (this.month == null)
		throw "Календарь не проинициализирован";

	if (this.month.getMonth() == 0) {
		this.month.setMonth(11);
		this.month.setYear(this.month.getFullYear() - 1);
	}
	else
		this.month.setMonth(this.month.getMonth() - 1);

	this.setMonth(this.month);
};

/* Перейти к следующему месяцу в календаре */
Calendar.prototype.nextMonth = function() {
	if (this.month == null)
		throw "Календарь не проинициализирован";

	if (this.month.getMonth() == 11) {
		this.month.setMonth(0);
		this.month.setYear(this.month.getFullYear() + 1);
	}
	else
		this.month.setMonth(this.month.getMonth() + 1);

	this.setMonth(this.month);
};

/* Обновить ячейку календаря, заново считав данные о событиях на эту дату из storage
   date - Дата (объект даты без времени)
   cell - Опционально, ячейка календаря, соответствующая этой дате.
          Если не передана, определяется автоматически */
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

/* Получить ячейку календаря, соответствующую указанной дате
   date - Дата (объект даты без времени)
   Результат - <td> обёрнутый в объект jQuery или null,
               если дата не присутствует на текущей странице календаря */
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
