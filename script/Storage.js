function Storage() {
	this.events = {};
	this._readLocalStorage();
}

Storage.prototype.addEvent = function(event) {
	var ts = event.date.valueOf();
	if (!this.events[ts])
		this.events[ts] = [];
	this.events[ts].push(event);
	this._updateLocalStorage(event.date);
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
	this._updateLocalStorage(event.date);
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
	this._updateLocalStorage(event.date);
};

Storage.prototype.getEventsForDay = function(date) {
	return this.events[date.valueOf()] || [];
};

Storage.prototype._readLocalStorage = function() {
	if (window.localStorage !== undefined)
		for (var i = 0; i < localStorage.length; i++) {
			var key = localStorage.key(i);
			if (key.startsWith("events.")) {
				var ts = parseInt(key.substring(7), 10);
				try {
					this.events[ts] = $.map(JSON.parse(localStorage[key]), function(event) {
						return EventData.deserialize(event);
					});
				}
				catch(e) {
					continue;
				}
			}
		}
};

Storage.prototype._updateLocalStorage = function(date) {
	if (window.localStorage !== undefined) {
		var ts = date.valueOf();
		localStorage["events." + ts] = JSON.stringify($.map(this.events[ts], function(event) {
			return event.serialize();
		}));
	}
};
