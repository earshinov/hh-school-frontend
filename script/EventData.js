function EventData(date, name, participants, description) {
	this.date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	this.name = name;
	this.participants = participants;
	this.description = description;
}
