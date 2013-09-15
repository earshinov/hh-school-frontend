function EventEditorPopup(popupController, $popup, okHandler) {
	var popup = this;

	Popup.call(this, popupController, $popup);
	this.okHandler = okHandler;

	/* копия редактируемого события */
	this.originalEvent = null;

	this.popup.keypress(function(e) {
		if (e.which == 13 /* Enter */) {
			$popup.find(".ok-button").click();
			return false;
		}
	});

	this.popup.find(".ok-button").click(function() {
		popup._ok();
	});
}

inherit(EventEditorPopup, Popup);

EventEditorPopup.prototype.show = function($cell, $place, event, closeHandler) {
	Popup.prototype.show.call(this, $place);

	this.originalEvent = event;

	this.popup.find(".event-name-text").val(event.name).removeClass("invalid").focus();
	this.popup.find(".participants-text").val(event.participants.join(", "));
	this.popup.find(".date-text").val(Dates.format(event.date)).removeClass("invalid");
	this.popup.find(".description-text").val(event.description);
};

EventEditorPopup.prototype.hide = function() {
	Popup.prototype.hide.call(this);

	this.originalEvent = null;
};

EventEditorPopup.prototype.isModified = function() {
	return ! this.originalEvent.equalsTo(this._getEvent());
};

EventEditorPopup.prototype._ok = function() {
	var event = this._getEvent();

	var nameValid = !! event.name;
	this.popup.find(".event-name-text").toggleClass("invalid", nameValid);

	var dateValid = event.date != null;
	this.popup.find(".date-text").toggleClass("invalid", dateValid);

	if (nameValid && dateValid && this.okHandler(event) !== false)
		this.hide();
};

/* Получить объект EventData с данными, введёнными в попапе */
EventEditorPopup.prototype._getEvent = function(validate) {
	return new EventData(
		Dates.parse(this.popup.find(".date-text").val()),
		this.popup.find(".event-name-text").val(),
		Utils.split(this.popup.find(".participants-text").val(), ","),
		this.popup.find(".description-text").val());
};
