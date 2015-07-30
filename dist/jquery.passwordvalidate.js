/*
 *  password-validate - v0.0.1
 *  Password validation JQuery plugin that allows custom rules
 *  https://github.com/anthony-benavente/passwordvalidate.git
 *
 *  Made by Anthony Benavente
 *  Under MIT License
 */
(function($, window, document) {
  var buildUi, element, initEvents, methods, pluginName, settings;
  pluginName = "passwordvalidate";
  element = {};
  settings = {};
  methods = {
    init: function(options) {
      settings = $.extend(true, $.fn[pluginName].defaults, options);
      element = $(this);
      return initEvents().buildUi();
    },
    isValid: function(word) {
      var allValid, rule;
      allValid = true;
      for (rule in settings.rules) {
        allValid = allValid && settings.rules[rule].criteria(word);
      }
      return defaultsDisabled || allValid;
    },
    disable: function() {
      return settings.disabled = true;
    },
    update: function() {},
    onKeyUp: function() {}
  };
  initEvents = function() {
    element.keyup(function() {
      return methods.onKeyUp();
    });
    return element;
  };
  buildUi = function() {
    $('.passwordvalidate-requirements').remove();
    if (settings.insertBeforeElement) {
      return $(settings.ui.createRequirementList()).insertBefore(element);
    }
    if (settings.insertAfterElement) {
      return $(settings.ui.createRequirementList()).insertAfter(element);
    }
    if (settings.insertBeforeParent) {
      return $(settings.ui.createRequirementList()).insertBefore(element.parent());
    }
    if (settings.insertAfterParent) {
      return $(settings.ui.createRequirementList()).insertAfter(element.parent());
    }
    return element;
  };
  $.fn[pluginName].defaults = {
    insertBeforeElement: false,
    insertAfterElement: false,
    insertBeforeParent: true,
    insertAfterParent: false,
    disabled: false,
    minLength: 6,
    rules: {
      pwdLength: {
        message: "Your password must be at least " + 6 + " characters long",
        criteria: function(word) {
          return word.length >= 6;
        }
      }
    },
    ui: {
      createRequirementList: function() {
        var rule, ul;
        ul = $('<ul class="passwordvalidate-requirements">');
        for (rule in settings.rules) {
          ul.append($('<li class="not-satisfied">').html(settings.rules[rule].message));
        }
        return ul;
      }
    }
  };
  return $.fn[pluginName] = function(options) {
    if (methods[options]) {
      return methods[options].apply(this, Array.prototype.alice.call(arguments, 1));
    } else if (typeof options === 'string' || !options) {
      return methods.init.apply(this, arguments);
    } else {
      return $.error(options + ' is not a valid method in password-validate');
    }
  };
})(jQuery, window, document);
