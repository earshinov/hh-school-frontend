function Storage() {
	this.events = {};
}

Storage.prototype.addEvent = function(event) {
	var ts = event.date.valueOf();
	if (!this.events[ts])
		this.events[ts] = [];
	this.events[ts].push(event);
};

Storage.prototype.updateEvent = function(originalEvent, event) {
	if (event.date.valueOf() !== originalEvent.date.valueOf()) {
		this.removeEvent(originalEvent);
		this.addEvent(event);
		return;
	}

	var ts = event.date.valueOf();
	var events = this.events[ts];
	if (!events)
		return;
	var pos = events.indexOf(originalEvent);
	if (pos === -1)
		return;
	events[pos] = event;
};

Storage.prototype.removeEvent = function(event) {
	var ts = event.date.valueOf();
	var events = this.events[ts];
	if (!events)
		return;
	var pos = events.indexOf(event);
	if (pos === -1)
		return;
	events.splice(pos, 1);
};

Storage.prototype.getEventsForDay = function(date) {
	return this.events[date.valueOf()] || [];
};
