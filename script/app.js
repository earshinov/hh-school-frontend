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
	var eventEditorPopup = new EventEditorPopup(popupController, $("#event-editor-popup"));

	$("#add-button").click(function(e) {
		var event = new EventData(null, "", [], "");
		eventEditorPopup.show($(e.target), event, {
			popupPlacement: "bottom",
			onOK: function(event, originalEvent) {
				storage.addEvent(event);
				calendar.updateCell(event.date);
			}
		});
	});

	$("#calendar-table")
		.bind("event-add", function(e, data) {
			var event = new EventData(data.date, "", [], "");

			// проставляем класс, чтобы оставить видимой кнопку добавления события
			var cell = $(e.target).parents("td:first");
			cell.addClass("hover");

			eventEditorPopup.show($(e.target), event, {
				onOK: function(event, originalEvent) {
					storage.addEvent(event);
					calendar.updateCell(event.date);
				},
				onHide: function() {
					cell.removeClass("hover");
				}
			});
		})
		.bind("event-edit", function(e, data) {
			eventEditorPopup.show($(e.target), data.event, {
				onOK: function(event, originalEvent) {
					storage.updateEvent(originalEvent, event);
					calendar.updateCell(originalEvent.date);
					if (event.date.valueOf() !== originalEvent.date.valueOf())
						calendar.updateCell(event.date);
				},
				onRemove: function(event) {
					storage.removeEvent(event);
					calendar.updateCell(event.date);
				}
			});
		});

	/* для доступа из Chrome Developer Tools */
	window.App = {
		storage: storage,
		calendar: calendar
	};
});
