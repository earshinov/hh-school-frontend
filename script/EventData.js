/* EventData - структура данных для хранения информации об одном событии
======================================================================== */

function EventData(date, name, participants, description) {
	this.date = date == null ? null : new Date(date.getFullYear(), date.getMonth(), date.getDate());
	this.name = name;
	this.participants = participants;
	this.description = description;
}

/* Совпадает ли этот объект EventData с переданным.
   Сравнение производится по содержимому полей.
   Результат - логическое значение true (объекты совпадают) или false (объекты различны) */
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

/* Сериализовать текущий объект EventData.
   Результат - EventData в сериализованном виде
               (данные, пригодные для передачи в JSON.stringify) */
EventData.prototype.serialize = function() {
	var data = $.extend(true, {}, this);
	data.date = this.date.valueOf();
	return data;
};

/* Десериализовать объект EventData.  "Статический метод".
   data - EventData в сериализованном виде
          (данные, когда-то возвращённые методом serialize)
   Результат - новый объект EventData */
EventData.deserialize = function(data) {
	return new EventData(
		new Date(data.date),
		data.name,
		data.participants,
		data.description);
};
