/* Базовый класс попапа */
function Popup(popupController, $popup) {
	this.popupController = popupController;
	this.popup = $popup;
}

/* Рекомендация, как писать функцию отображения попапа */
Popup.prototype.show = function($place) {
	this.popupController.showPopup(this, $place);
};

/* Функция сокрытия попапа */
Popup.prototype.close = function() {
	this.popupController.hidePopup();
};


function PopupController($popupOverlay) {
	var popupController = this;

	this.POPUP_POINTER_TOP_OFFSET = 30;
	this.POPUP_POINTER_WIDTH = 12;

	this.overlay = $popupOverlay;

	/* текущий отображённый попап */
	this.popup = null;

	this.overlay.click(function(event) {
		popupController.popup.close();
	});
}

PopupController.prototype.showPopup = function(popup, $place) {
	if (this.popup)
		throw "Нельзя открыть несколько попапов одновременно";

	var $popup = popup.popup;

	var placeWidth = $place.outerWidth();
	var parent = $place.offsetParent();
	var offset = $place.offset();

	offset.top -= this.POPUP_POINTER_TOP_OFFSET;
	offset.top += $place.height() / 2;

	$popup.appendTo(parent).css('top', offset.top).show();
	var popupWidth = $popup.outerWidth();

	var leftPlacement = false;
	if (offset.left + placeWidth + popupWidth > parent.width() && popupWidth < offset.left)
		leftPlacement = true;

	if (leftPlacement) {
		$popup.removeClass('right');
		$popup.addClass('left');
		$popup.css('left', offset.left - popupWidth - this.POPUP_POINTER_WIDTH);
	}
	else {
		$popup.removeClass('left');
		$popup.addClass('right');
		$popup.css('left', offset.left + placeWidth + this.POPUP_POINTER_WIDTH);
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
