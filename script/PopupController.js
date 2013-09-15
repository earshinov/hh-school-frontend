/* Базовый класс попапа */
function Popup(popupController, $popup) {
	var popup = this;

	this.popupController = popupController;
	this.popup = $popup;

	this.popup.keydown(function(e) {
		if (e.which == 27 /* Esc */) {
			popup.close();
			return false;
		}
	});

	this.popup.find(".popup-close").click(function() {
		popup.close();
	});
}

/* Рекомендация, как писать функцию отображения попапа */
Popup.prototype.show = function($place, placement) {
	this.popupController.showPopup(this, $place, placement);
};

/* Функция, возвращающая признак, что пользователь изменил содержимое попапа */
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


function PopupController($popupOverlay) {
	var popupController = this;

	this.POPUP_POINTER_OFFSET = 30;
	this.POPUP_POINTER_SIZE = 12;

	this.overlay = $popupOverlay;

	/* текущий отображённый попап */
	this.popup = null;

	this.overlay.click(function() {
		popupController.popup.close();
	});
}

PopupController.prototype.showPopup = function(popup, $place, placement) {
	if (this.popup)
		throw "Нельзя открыть несколько попапов одновременно";

	var $popup = popup.popup;

	var placeWidth = $place.outerWidth();
	var placeHeight = $place.outerHeight();
	var parent = $place.offsetParent();
	var offset = $place.offset();

	$popup.appendTo(parent).show();
	var popupWidth = $popup.outerWidth();

	if (!placement)
		placement = (offset.left + placeWidth + popupWidth > parent.width() && popupWidth < offset.left) ? "left" : "right";

	$popup.removeClass("left");
	$popup.removeClass("right");
	$popup.removeClass("bottom");
	$popup.addClass(placement);

	switch (placement) {
		case "left":
			$popup.css("left", offset.left - popupWidth - this.POPUP_POINTER_SIZE);
			$popup.css("top", offset.top - this.POPUP_POINTER_OFFSET + placeHeight / 2);
			break;
		case "right":
			$popup.css("left", offset.left + placeWidth + this.POPUP_POINTER_SIZE);
			$popup.css("top", offset.top - this.POPUP_POINTER_OFFSET + placeHeight / 2);
			break;
		case "bottom":
			$popup.css("left", offset.left - this.POPUP_POINTER_OFFSET + placeWidth / 2);
			$popup.css("top", offset.top + placeHeight + this.POPUP_POINTER_SIZE);
			break;
	}

	this.overlay.css({
		width: $(document).width(),
		height: $(document).height()
	}).show();

	this.popup = popup;
};

PopupController.prototype.hidePopup = function() {
	if (this.popup) {
		this.popup.popup.hide();
		this.overlay.hide();
		this.popup = null;
	}
};
