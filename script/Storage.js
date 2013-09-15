function Storage() {
	this.events = {};
}

Storage.prototype.addEvent = function(event) {
	var ts = event.date.valueOf();
	if (!this.events[ts])
		this.events[ts] = [];
	this.events[ts].push(event);
};

Storage.prototype.getEventsForDay = function(date) {
	return this.events[date.valueOf()] || [];
};
