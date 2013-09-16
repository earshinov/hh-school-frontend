/* PopupController - компонент, управляющий отображением попапов на странице.
   В частности, обеспечивает, что:
     - единовременно может быть открыт только один попап
     - по клику в документе текущий попап закрывается (для этого в DOM-дереве предусмотрен элемент overlay)
=========================================================================================================== */

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

/* Отобразить попап
   popup - объект Popup
   $place - DOM-элемент, к которому приаттачить попап
   placement - опциональное расположение попапа - строка left | right | bottom
               Если не передано, автоматически выбирается left | right */
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

/* Скрыть текущий попап */
PopupController.prototype.hidePopup = function() {
	if (this.popup) {
		this.popup.popup.hide();
		this.overlay.hide();
		this.popup = null;
	}
};
