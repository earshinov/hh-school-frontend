function EventPopup(popupController, $popup, okHandler) {
	Popup.call(this, popupController, $popup);

	/* ячейка календаря, которой соответствует редактируемое событие */
	this.cell = null;

	this.popup.find(".ok-button").click(function() {
		if (okHandler() !== false)
			this.close();
	});
}

inherit(EventPopup, Popup);

EventPopup.prototype.show = function($cell, $place) {
	this.cell = $cell;
	this.cell.addClass("active");
	Popup.prototype.show.call(this, $place);
	this.popup.find(".event-name-text").focus();
};

EventPopup.prototype.close = function() {
	this.cell.removeClass("active");
	Popup.prototype.close.call(this);
};
