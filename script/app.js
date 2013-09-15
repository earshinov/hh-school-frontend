$( function() {

	var storage = new Storage();

	var calendar = new Calendar(storage,
		$("#calendar-table"),
		$("#calendar-month"),
		$("#calendar-cell-template"),
		$("#calendar-event-template"));
	calendar.setMonth(new Date());

	$("#prev-month-button").click(function() {
		calendar.prevMonth();
	});
	$("#today-button").click(function() {
		calendar.setMonth(new Date());
	});
	$("#next-month-button").click(function() {
		calendar.nextMonth();
	});

	var popupController = new PopupController($("#popup-overlay"));

	var eventEditorPopup = new EventEditorPopup(popupController, $("#event-popup"), function(event) {
		storage.addEvent(event);
		calendar.addEvent(event);
	});

	$("#calendar-table").delegate('td', 'hover', function(e) {
		$(this).toggleClass('hover', e.type === 'mouseenter');
	});
	$("#calendar-table").delegate('.add-event-button', 'click', function() {
		var cell = $(this).parents("td:first");
		var date = calendar.dateByCell(cell);
		var event = new EventData(date, "", [], "");
		eventEditorPopup.show(cell, $(this), event);
	});

	/* для доступа из Chrome Developer Tools */
	window.App = {
		storage: storage,
		calendar: calendar
	};
});
