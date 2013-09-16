/* Popup - базовый класс попапа, заточенный на работу с PopupController
======================================================================= */

function Popup(popupController, $popup) {
	var popup = this;

	this.popupController = popupController;
	this.popup = $popup;

	/* обработка нажатия клавиши Esc */
	this.popup.keydown(function(e) {
		if (e.which == 27 /* Esc */) {
			popup.close();
			return false;
		}
	});

	/* обработка нажатия на крестик закрытия попапа */
	this.popup.find(".popup-close").click(function() {
		popup.close();
	});
}

/* Показать этот попап.
   См. PopupController.showPopup() */
Popup.prototype.show = function($place, placement) {
	this.popupController.showPopup(this, $place, placement);
};

/* Изменено ли содержимое попапа? */
Popup.prototype.isModified = function() {
	return false;
};

/* Закрыть попап, запросив подтверждение пользователя в случае наличия изменений */
Popup.prototype.close = function() {
	if (this.isModified() && !confirm("Внесённые изменения не будут сохранены.  Продолжить?"))
		return;
	this.hide();
};

/* Закрыть попап без подтверждения */
Popup.prototype.hide = function() {
	this.popupController.hidePopup();
};
