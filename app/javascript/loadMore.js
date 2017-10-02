function loadMore(loadMoreEntries) {
  $(window).scroll(function() {
    if ($('#scroll-to').length) {
      var hT = $('#scroll-to').offset().top,
        hH = $('#scroll-to').outerHeight(),
        wH = $(window).height(),
        wS = $(this).scrollTop();
      if (wS > (hT + hH - wH) && (hT > wS) && (wS + wH > hT + hH)) {
        if (loadMoreEntries) {
          loadMoreEntries();
        }
      }
    }
  });
}
function dropdownFilter() {
  $('li.dropdown').each(function() {
    if ($(this).has('ul')) {
      $(this).addClass('has-menu-child');
    }
  });
  $('li.dropdown > a').click(function() {
    if ($(this).parent().hasClass('active')) {
      $(this).parent().removeClass('active');
      $(this).parent().find('ul').slideUp(200);
    } else {
      $('li.dropdown').removeClass('active');
      $('li.dropdown > ul').hide();
      $(this).parent().addClass('active');
      $(this).parent().find('ul').slideDown(200);
    }
  });
}
function closeFilter() {
  $('.filter-menu .close').click(function() {
    $('.filter-menu li.dropdown').removeClass('active');
    $('.filter-menu li.dropdown > ul').slideUp(200);
  });
}
function checkFilter() {
  $('.filter-menu li > ul > li > a').click(function() {
    if ($(this).parent().hasClass('check-all')) {
      if ($(this).parent().hasClass('checked')) {
        console.log('checked');
        // remove checked all in checkbox
        $(this).parent().parent().find('li').removeClass('checked');
      } else {
        // checked all in checkbox
        $(this).parent().parent().find('li').addClass('checked');
      }
    } else {
      if ($(this).parent().hasClass('checked')) {
        // remove checked in checkbox
        $(this).parent().removeClass('checked');
        // remove checked in check all
        $(this).parent().parent().find('.check-all').removeClass('checked');
      } else {
        // checked in checkbox
        $(this).parent().addClass('checked');
      }
    }
  });
}

export {loadMore, dropdownFilter, closeFilter, checkFilter}
