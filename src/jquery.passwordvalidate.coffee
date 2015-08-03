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

	currentPassword = ""

	reqList = {}

	validations = {}

	methods =
		init: (options) ->
			settings = $.extend true, $.fn[pluginName].defaults, options
			element = $(this)
			initEvents()
			buildUi()
		isValid: () ->
			allValid = true;
			allValid = allValid and settings.rules[rule].criteria(currentPassword) for rule of settings.rules
			return settings.disabled || allValid
		disable: ->
			settings.disabled = true
		update: ->
			currentPassword = element.val()
			validations = checkValidations()
			updateList()
		onKeyUp: ->
			methods.update()

	initEvents = ->
		element.keyup ->
			methods.onKeyUp()
		for extraElement of settings.additionalTriggers
			$(settings.additionalTriggers[extraElement]).keyup ->
				methods.onKeyUp()
		return element;

	updateList = ->
		for rule of settings.rules
			matched = reqList.find('li').filter ->
				return $(this).data('rule') == rule
			if validations[rule]
				matched.addClass('validate-passed')
				matched.removeClass('validate-failed')
			else
				matched.addClass('validate-failed')
				matched.removeClass('validate-passed')
		return element

	buildUi = ->
		reqList = $(settings.ui.createRequirementList());

		if settings.targetContainer == ''
			if settings.insertBeforeElement then return reqList.insertBefore(element)
			if settings.insertAfterElement then return reqList.insertAfter(element)
			if settings.insertBeforeParent then return reqList.insertBefore(element.parent())
			if settings.insertAfterParent then return reqList.insertAfter(element.parent())
		else
			$(settings.targetContainer).append(reqList)

		return element;

	checkValidations = ->
		validations = {}
		for rule of settings.rules
			validations[rule] = settings.rules[rule].criteria(currentPassword);
		return validations

	$.fn[pluginName] = (options) ->
		if methods[options]
			if (arguments.length > 1)
				return methods[options].apply this, Array.prototype.alice.call(arguments, 1)
			else
				return methods[options]()
		else if typeof options is 'object' or not options
			return methods.init.apply this, arguments
		else
			$.error options + ' is not a valid method in password-validate'

	$.fn[pluginName].defaults =
		insertBeforeElement: false
		insertAfterElement: false
		insertBeforeParent: true
		insertAfterParent: false
		disabled: false
		minLength: 6,
		targetContainer: ''
		additionalTriggers: []
		rules:
			pwdLength:
				message: "Your password must be at least " + 6 + " characters long"
				criteria: (word) ->
					return word.length >= 6
		ui:
			createRequirementList: ->
				ul = $('<ul class="validate-requirements">')
				ul.append($('<li>').html(settings.rules[rule].message).data('rule', rule)) for rule of settings.rules
				return ul
