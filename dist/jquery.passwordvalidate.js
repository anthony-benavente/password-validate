/*
 *  password-validate - v0.0.1
 *  Password validation JQuery plugin that allows custom rules
 *  https://github.com/anthony-benavente/passwordvalidate.git
 *
 *  Made by Anthony Benavente
 *  Under MIT License
 */
(function($, window, document) {
  var buildUi, checkValidations, currentPassword, element, initEvents, methods, pluginName, reqList, settings, updateList, validations;
  pluginName = "passwordvalidate";
  element = {};
  settings = {};
  currentPassword = "";
  reqList = {};
  validations = {};
  methods = {
    init: function(options) {
      settings = $.extend(true, $.fn[pluginName].defaults, options);
      element = $(this);
      initEvents();
      return buildUi();
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
    update: function() {
      currentPassword = element.val();
      validations = checkValidations();
      return updateList();
    },
    onKeyUp: function() {
      return methods.update();
    }
  };
  initEvents = function() {
    var extraElement;
    element.keyup(function() {
      return methods.onKeyUp();
    });
    for (extraElement in settings.additionalTriggers) {
      $(settings.additionalTriggers[extraElement]).keyup(function() {
        return methods.onKeyUp();
      });
    }
    return element;
  };
  updateList = function() {
    var matched, rule;
    for (rule in settings.rules) {
      matched = reqList.find('li').filter(function() {
        return $(this).data('rule') === rule;
      });
      if (validations[rule]) {
        matched.addClass('validate-passed');
        matched.removeClass('validate-failed');
      } else {
        matched.addClass('validate-failed');
        matched.removeClass('validate-passed');
      }
    }
    return element;
  };
  buildUi = function() {
    reqList = $(settings.ui.createRequirementList());
    if (settings.targetContainer === '') {
      if (settings.insertBeforeElement) {
        return reqList.insertBefore(element);
      }
      if (settings.insertAfterElement) {
        return reqList.insertAfter(element);
      }
      if (settings.insertBeforeParent) {
        return reqList.insertBefore(element.parent());
      }
      if (settings.insertAfterParent) {
        return reqList.insertAfter(element.parent());
      }
    } else {
      $(settings.targetContainer).append(reqList);
    }
    return element;
  };
  checkValidations = function() {
    var rule;
    validations = {};
    for (rule in settings.rules) {
      validations[rule] = settings.rules[rule].criteria(currentPassword);
    }
    return validations;
  };
  $.fn[pluginName] = function(options) {
    if (methods[options]) {
      return methods[options].apply(this, Array.prototype.alice.call(arguments, 1));
    } else if (typeof options === 'object' || !options) {
      return methods.init.apply(this, arguments);
    } else {
      return $.error(options + ' is not a valid method in password-validate');
    }
  };
  return $.fn[pluginName].defaults = {
    insertBeforeElement: false,
    insertAfterElement: false,
    insertBeforeParent: true,
    insertAfterParent: false,
    disabled: false,
    minLength: 6,
    targetContainer: '',
    additionalTriggers: [],
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
        ul = $('<ul class="validate-requirements">');
        for (rule in settings.rules) {
          ul.append($('<li>').html(settings.rules[rule].message).data('rule', rule));
        }
        return ul;
      }
    }
  };
})(jQuery, window, document);
