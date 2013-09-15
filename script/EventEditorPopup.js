function EventEditorPopup(popupController, $popup) {
	var popup = this;

	Popup.call(this, popupController, $popup);

	/* копия редактируемого события */
	this.originalEvent = null;

	/* дополнительные параметры, которые передаются при отображении попапа */
	this.config = null;

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

EventEditorPopup.prototype.show = function($place, event, config) {
	Popup.prototype.show.call(this, $place);

	this.originalEvent = event;
	this.config = config;

	this.popup.find(".event-name-text").val(event.name).removeClass("invalid").focus();
	this.popup.find(".participants-text").val(event.participants.join(", "));
	this.popup.find(".date-text").val(Dates.format(event.date)).removeClass("invalid");
	this.popup.find(".description-text").val(event.description);
};

EventEditorPopup.prototype.hide = function() {
	if (this.config && this.config.onHide)
		this.config.onHide();

	Popup.prototype.hide.call(this);

	this.originalEvent = null;
	this.config = null;
};

EventEditorPopup.prototype.isModified = function() {
	return ! this.originalEvent.equalsTo(this._getEvent());
};

EventEditorPopup.prototype._ok = function() {
	var event = this._getEvent();

	var nameValid = !! event.name;
	this.popup.find(".event-name-text").toggleClass("invalid", ! nameValid);

	var dateValid = event.date != null;
	this.popup.find(".date-text").toggleClass("invalid", ! dateValid);

	if (nameValid && dateValid) {
		if (this.config && this.config.onOK)
			this.config.onOK(event, this.originalEvent);
		this.hide();
	}
};

/* Получить объект EventData с данными, введёнными в попапе */
EventEditorPopup.prototype._getEvent = function(validate) {
	return new EventData(
		Dates.parse(this.popup.find(".date-text").val()),
		this.popup.find(".event-name-text").val(),
		Utils.split(this.popup.find(".participants-text").val(), ","),
		this.popup.find(".description-text").val());
};
