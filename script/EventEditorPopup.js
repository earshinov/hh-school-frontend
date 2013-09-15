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
	this.popup.find(".remove-button").click(function() {
		popup._remove();
	});
}

inherit(EventEditorPopup, Popup);

EventEditorPopup.prototype.show = function($place, event, config) {
	var placement = config && config.popupPlacement || null;
	Popup.prototype.show.call(this, $place, placement);

	this.originalEvent = event;
	this.config = config;

	this.popup.find(".event-name-text").val(event.name).removeClass("invalid").focus();
	this.popup.find(".participants-text").val(event.participants.join(", "));
	this.popup.find(".date-text").val(event.date == null ? "" : Dates.format(event.date)).removeClass("invalid");
	this.popup.find(".description-text").val(event.description);

	/* кнопка Удалить видима, только если задан соответствующий обработчик */
	this.popup.find(".remove-button").toggle(!!(this.config && this.config.onRemove));
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

EventEditorPopup.prototype._remove = function() {
	if (confirm("Вы действительно хотите удалить событие?")) {
		if (this.config && this.config.onRemove)
			this.config.onRemove(this.originalEvent);
		this.hide();
	}
};

/* Получить объект EventData с данными, введёнными в попапе */
EventEditorPopup.prototype._getEvent = function() {
	return new EventData(
		Dates.parse(this.popup.find(".date-text").val()),
		this.popup.find(".event-name-text").val(),
		Utils.split(this.popup.find(".participants-text").val(), ","),
		this.popup.find(".description-text").val());
};
