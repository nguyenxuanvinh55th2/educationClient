function Search(){
	$('.icon-search').click(function() {
		$('.header-top .form-group').addClass('active-search');
	});

}
function removeMenuSearch() {
	$('.header-main li a,.menu-mobile li a').click(function() {
		$('.box-search').removeClass('remove');
	});
}
function removeSearch() {
	$('#header .icon-search,.box-search .close').click(function() {
		if($('.box-search').hasClass('remove')){
			$('.box-search').removeClass('remove');
		}
		else{
			$('.box-search').addClass('remove');
		}
	});
}
function removeMenu() {
	var $val2 =  $("#header .menu-control");
	$(document).click(function(){
		if(!$(event.target).is(".menu-control *, #header .menu-control")){
			$val2.each(function(index, el) {
				if ($(this).val().length<1) {
					$(this).parents('#header').removeClass('active-menu');
				}
			});
		}
	});
}
function PinHeader(){
	$(window).scroll(function() {
		if($(window).scrollTop() >26){
			$('#header').addClass('pin-header');
		}
		else{
			$('#header').removeClass('pin-header');
		}
	});
}
function PinTop(){
	$(window).scroll(function() {
		if($(window).scrollTop()>0){
			$('.pin-top').addClass('active');
		}
		else{
			$('.pin-top').removeClass('active');
		}
	});
	$('.pin-top').click(function() {
		$('html,body').animate({scrollTop: 0}, 700)
	});
}
function showProduct(){
	$('.sec-product').each(function() {
		var heightWindow = $(window).height();
		var heightSecToHeader = $(this).offset().top;
		var heightSec = $(this).find('.box-item').innerHeight();
		var total = heightSecToHeader-heightWindow-heightSec;
		$(window).scroll(function() {
			if($(window).scrollTop()>total){
				$(this).addClass('active');
			}
		}.bind(this));
	});
}
function menuMobile(){
	$('.menu-control').click(function() {
		if($('#header').hasClass('active-menu')){
			$('#header').removeClass('active-menu');
		}
		else{
			$('#header').addClass('active-menu');
		}
	});
}
function slideChitiet(){
	$('.click-anh ul li').click(function() {
		$('.show-anh .item').removeClass('active');
		var value = $(this).attr('data');
		$('.show-anh .item'+value).addClass('active');

	});
}
function slideAds(){
	$('.bxslider').bxSlider();
}
export {Search, removeSearch, PinHeader, PinTop, showProduct, menuMobile, slideChitiet, removeMenu, removeMenuSearch, slideAds  }
