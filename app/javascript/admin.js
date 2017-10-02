function hide_nav_menu() {
  $('.header-admin ul').find('li').not('.dropdown').click(function(){$('.navbar-collapse').removeClass('in')})
}
export { hide_nav_menu }
