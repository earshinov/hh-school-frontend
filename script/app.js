$( function() {
	var calendar = new Calendar($("#calendar-month"), $("#calendar-table"), $("#calendar-cell-template"));
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

	var eventPopup = new EventPopup(popupController, $("#event-popup"));

	$("#calendar-table").delegate('td', 'hover', function(event) {
		$(this).toggleClass('hover', event.type === 'mouseenter');
	});
	$("#calendar-table").delegate('.add-event-button', 'click', function() {
		eventPopup.show($(this).parents("td:first"), $(this));
	});
});
