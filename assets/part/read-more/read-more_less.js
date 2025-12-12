$(document).ready(function () {
  $(".readMore").click(function () {
    var parent = $(this).closest("p");
    parent.find(".dots, .readMore").css("display", "none");
    parent.find(".moreText, .readLess").css("display", "inline");
  });

  $(".readLess").click(function () {
    var parent = $(this).closest("p");
    parent.find(".dots, .readMore").css("display", "inline");
    parent.find(".moreText, .readLess").css("display", "none");
  });
});
