function loadDomesticTourPopup(closeTour) {
	if (window.innerWidth > 767) {
		$("#DomesticTourPopup").appendTo("body").css("z-index", "10000")
		$('#DomesticTourPopup').modal('show');
	}
	$('#DomesticTourPopup').on('hidden', function (e) {
	 	$(this).data('modal', null);
		closeTour.props.handleClose();
	})
}
function hideDomesticTourPopup() {
    $('#DomesticTourPopup').modal('toggle');
}

function loadHomePopup() {
	if (window.innerWidth > 767) {
	    $('#HomePopup').modal('show');
	}
}
function hideHomePopup() {
    $('#HomePopup').modal('hide');
}
function displayContactInfo() {
	$('.book-tour-contact-info').toggle(200);
}

export { loadDomesticTourPopup, hideDomesticTourPopup, loadHomePopup, hideHomePopup, displayContactInfo }
