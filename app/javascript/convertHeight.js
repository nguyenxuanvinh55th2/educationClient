'use strict';
var heightEqua = (function() {
  function convertHeight() {
    (function($) {
      $.fn.convert_height = function() {
        var element = $(this)
        $(element).innerHeight("auto");
        var h_ = 0;
        var itemss = $(element);
        itemss.each(function() {
          if (h_ < $(this).innerHeight())
            h_ = $(this).innerHeight();
          }
        )
        itemss.each(function() {
          $(this).innerHeight(h_);
        })
      };
    }(jQuery));
  }
  function feedHieght() {
    $(".sec-book-tour").each(function() {
      $(this).find("img").convert_height();
      $(this).find(".text-item").convert_height();
    });
    $(".slider-tintuc").each(function() {
      $(this).find("img").convert_height();
      $(this).find(".text-item").convert_height();
    });
    $(".tintuc-and-sukien-home").each(function() {
      $(this).find("img").convert_height();
      $(this).find(".text-item").convert_height();
    });
    $(".DomesticTour-group").each(function() {
      $(this).find("img").convert_height();
      $(this).find(".content").convert_height();
    });
  }
  function resizeHeight() {
    feedHieght();
  }
  function init() {
    convertHeight();
    resizeHeight();
    $(window).on('load', function() {
      feedHieght();
    });
    $(window).on('resize', function() {
      feedHieght();
    });
  }
  return {init: init}
})();

export {heightEqua};
