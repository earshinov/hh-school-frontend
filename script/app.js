$( function() {
	var calendar = new Calendar($("#calendar-month"), $("#calendar-table"));
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
});
