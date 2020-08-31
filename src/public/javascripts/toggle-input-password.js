
document.addEventListener('DOMContentLoaded', function(event) {

  $("[data-toggle-to]").each(function() {
    let parentToggleElement = $(this);
    let iconElement = parentToggleElement.children();
    let inputPwdElement = parentToggleElement.siblings("input[type=password]");
    let fromCssClass = parentToggleElement.data("toggle-from");
    let toCssClass = parentToggleElement.data("toggle-to");
    $(this).click(function() {
      if (iconElement.hasClass(fromCssClass)) {
        // Show password
        iconElement.removeClass(fromCssClass);
        iconElement.addClass(toCssClass);
        inputPwdElement.attr('type', 'text');
      } else if (iconElement.hasClass(toCssClass)) {
        // Hide password
        iconElement.removeClass(toCssClass);
        iconElement.addClass(fromCssClass);
        inputPwdElement.attr('type', 'password');
      }
    });
  });

});
