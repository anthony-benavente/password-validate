# Note that when compiling with coffeescript, the plugin is wrapped in another
# anonymous function. We do not need to pass in undefined as well, since
# coffeescript uses (void 0) instead.
do ($ = jQuery, window, document) ->

	# window and document are passed through as local variable rather than global
	# as this (slightly) quickens the resolution process and can be more efficiently
	# minified (especially when both are regularly referenced in your plugin).

	# Create the defaults once
	pluginName = "passwordvalidate"

	element = {}

	settings = {}

	methods =
		init: (options) ->
			settings = $.extend true, $.fn[pluginName].defaults, options
			element = $(this)
			return initEvents().buildUi();
		isValid: (word) ->
			allValid = true;
			allValid = allValid and settings.rules[rule].criteria(word) for rule of settings.rules
			return defaultsDisabled || allValid
		disable: ->
			settings.disabled = true
		update: ->
			# TODO:
		onKeyUp: ->
			# TODO:

	initEvents = ->
		element.keyup ->
			methods.onKeyUp()
		return element;

	buildUi = ->
		$('.passwordvalidate-requirements').remove();
		if settings.insertBeforeElement then return $(settings.ui.createRequirementList()).insertBefore(element)
		if settings.insertAfterElement then return $(settings.ui.createRequirementList()).insertAfter(element)
		if settings.insertBeforeParent then return $(settings.ui.createRequirementList()).insertBefore(element.parent())
		if settings.insertAfterParent then return $(settings.ui.createRequirementList()).insertAfter(element.parent())
		return element;

	$.fn[pluginName].defaults =
		insertBeforeElement: false
		insertAfterElement: false
		insertBeforeParent: true
		insertAfterParent: false
		disabled: false
		minLength: 6
		rules:
			pwdLength:
				message: "Your password must be at least " + 6 + " characters long"
				criteria: (word) ->
					return word.length >= 6
		ui:
			createRequirementList: ->
				ul = $('<ul class="passwordvalidate-requirements">')
				ul.append($('<li class="not-satisfied">').html(settings.rules[rule].message)) for rule of settings.rules
				return ul

	$.fn[pluginName] = (options) ->
		if methods[options]
			return methods[options].apply this, Array.prototype.alice.call(arguments, 1)
		else if typeof options is 'string' or not options
			return methods.init.apply this, arguments
		else
			$.error options + ' is not a valid method in password-validate'
