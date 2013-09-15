function EventData(date, name, participants, description) {
	this.date = date == null ? null : new Date(date.getFullYear(), date.getMonth(), date.getDate());
	this.name = name;
	this.participants = participants;
	this.description = description;
}

EventData.prototype.equalsTo = function(other) {
	if (other == null)
		return false;
	var datesEqual =
		(this.date == null || other.date == null)
			? this.date == other.date
			: this.date.valueOf() == other.date.valueOf();
	return (datesEqual
		&& this.name == other.name
		&& this.description == other.description
		&& Utils.arraysEqual(this.participants, other.participants));
};
