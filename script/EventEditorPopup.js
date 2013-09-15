function EventEditorPopup(popupController, $popup, okHandler) {
	var popup = this;

	Popup.call(this, popupController, $popup);
	this.okHandler = okHandler;

	/* копия редактируемого события */
	this.event = null;

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

	this.event = event;

	this.popup.find(".event-name-text").val(event.name).removeClass("invalid").focus();
	this.popup.find(".participants-text").val(event.participants.join(", "));
	this.popup.find(".date-text").val(Dates.format(event.date)).removeClass("invalid");
	this.popup.find(".description-text").val(event.description);
};

EventEditorPopup.prototype._ok = function() {
	var valid = true;

	var $name = this.popup.find(".event-name-text");
	if ($name.val())
		$name.removeClass("invalid");
	else {
		$name.addClass("invalid");
		valid = false;
	}

	var $date = this.popup.find(".date-text");
	var date = Dates.parse($date.val());
	if (date !== null)
		$date.removeClass("invalid");
	else {
		$date.addClass("invalid");
		valid = false;
	}

	if (!valid)
		return;

	var participants = Utils.split(this.popup.find(".participants-text").val(), ",");
	var event = new EventData(date, $name.val(), participants, this.popup.find(".description-text").val());
	if (this.okHandler(event) !== false)
		this.close();
};

EventEditorPopup.prototype.close = function() {
	Popup.prototype.close.call(this);

	this.event = null;
};
