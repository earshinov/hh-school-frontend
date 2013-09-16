/* Storage - хранение информации о событиях с поддержкой LocalStorage (если последний поддерживается браузером)
=============================================================================================================== */

function Storage() {

	/* Хранилище событий - ассоциативный массив (дата => список событий на указанную дату)
	   Ключ - timestamp даты без времени
	   Значение - массив объектов EventData */
	this.events = {};

	this._readLocalStorage();
}

/* Добавить событие
   event - объект EventData */
Storage.prototype.addEvent = function(event) {
	var ts = event.date.valueOf();
	if (!this.events[ts])
		this.events[ts] = [];
	this.events[ts].push(event);
	this._updateLocalStorage(event.date);
};

/* Обновить событие
   originalEvent - оригинальное событие (объект EventData)
   event - обновлённое событие (объект EventData) */
Storage.prototype.updateEvent = function(originalEvent, event) {
	if (event.date.valueOf() != originalEvent.date.valueOf()) {
		this.removeEvent(originalEvent);
		this.addEvent(event);
		return;
	}

	/* Если дата события не поменялась, нельзя реализовать обновление через удаление и добавление,
	потому что в этом случае может испортиться порядок событий на эту дату.  Вместо этого
	находим огигинальное событие и заменяем его in-place */
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

/* Удалить событие из хранилища
   event - объект EventData */
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

/* Получить список событий на указанную дату
   date - Дата (объект даты без времени)
   Результат - Массив объектов EventData */
Storage.prototype.getEventsForDay = function(date) {
	return this.events[date.valueOf()] || [];
};

/* Заполнение ассоциативного массива events данными из LocalStorage.  Вспомогательный метод */
Storage.prototype._readLocalStorage = function() {
	if (window.localStorage !== undefined)
		for (var i = 0; i < localStorage.length; i++) {
			var key = localStorage.key(i);
			if (key.startsWith("events.")) {
				var ts = parseInt(key.substring(7), 10);
				try {
					this.events[ts] = $.map(JSON.parse(localStorage[key]), EventData.deserialize);
				}
				catch(e) {
					/* на случай если в LocalStorage попадут данные в неправильном формате */
					continue;
				}
			}
		}
};

/* Сохранить LocalStorage данные из хранилища на указанную дату
   date - дата (объект даты без времени) */
Storage.prototype._updateLocalStorage = function(date) {
	if (window.localStorage !== undefined) {
		var ts = date.valueOf();
		localStorage["events." + ts] = JSON.stringify($.map(this.events[ts], function(event) {
			return event.serialize();
		}));
	}
};
