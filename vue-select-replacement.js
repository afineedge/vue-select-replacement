'use strict';

/* global Popper:false */

Vue.component('vue-select-replacement', {
	props: {
		options: {
			default: [],
			type: Array,
			required: true
		},
		searchable: {default: false},
		actions: {default: false},
		multiple: {default: false},
		max: {default: false},
		placeholder: {default: 'Nothing selected'},
		displayformat: {default: 'name'},
		classes: {default: null},
		value: {default: null}
	},
	data: function() {
		return {
			searchTerm: '',
			active: false,
			disabled: false
		};
	},
	template: `<div class="vue-select-replacement">
		<button type="button" v-html="display" v-on:click="active = !active" v-bind:disabled="disabled" v-bind:class="classes">
		</button>
		<div class="card w-auto scroll-y" v-if="active" style="position: fixed; z-index: 1;">
			<div class="m-1" v-if="searchable">
				<input type="text" class="form-control form-control-sm" placeholder="Search..." v-model="searchTerm">
			</div>
			<div class="mx-1 border-bottom" v-if="actions">
				<div class="row no-gutters">
					<div class="col">
						<button type="button" class="btn btn-block btn-sm rounded-0" v-on:click="deselectAll(undefined)">
							Deselect All
						</button>
					</div>
					<div class="col" v-if="multiple">
						<button type="button" class="btn btn-block btn-sm btn-secondary rounded-0" v-on:click="selectAll(undefined)">
							Select All
						</button>
					</div>
					<div class="col" v-if="searchTerm.length > 0 && multiple">
						<button type="button" class="btn btn-block btn-sm btn-secondary rounded-0" v-on:click="selectFiltered">
							Select Filtered
						</button>
					</div>
					<div class="col" v-if="searchTerm.length > 0 && multiple">
						<button type="button" class="btn btn-block btn-sm btn-secondary rounded-0" v-on:click="selectOnlyFiltered">
							Select Only Filtered
						</button>
					</div>
				</div>
			</div>
			<div class="mt-1">
				<div class="p-2 small" v-if="filteredOptions.length < 1" v-on:click="active = false">No options available</div>
				<template v-for="option in filteredOptions">
					<vue-select-replacement-option v-bind:option="option"></vue-select-replacement-option>
				</template>
			</div>
		</div>
	</div>`,
	components: {
		'vue-select-replacement-option': {
			name: 'vue-select-replacement-option',
			template: `<div v-if="visible">
				<div class="p-2 small border-bottom option" v-html="option.name" v-on:click="setValue(option.id)" v-bind:class=" {'active': active}"></div>
				<div v-if="option.options" class="pl-3">
					<template v-for="option in option.options">
						<vue-select-replacement-option v-bind:option="option"></vue-select-replacement-option>
					</template>
				</div>
			</div>`,
			props: {
				option: {default: {} },
				visible: {default: true}
			},
			data: function() {
				return {disabled: false};
			},
			computed: {
				active: function() {
					var self = this;
					var parent = self.$parent;

					if (typeof parent.value === 'undefined' && parent.$parent) {
						parent = parent.$parent;
						if (typeof parent.value === 'undefined' && parent.$parent) {
							parent = parent.$parent;
						}
					}
					if (!parent.multiple) {
						if (self.option.id === parent.value) {
							return true;
						}

						return false;

					}
					if ($.inArray(self.option.id, parent.value) > -1) {
						return true;
					}

					return false;

				},
				isVisible: function() {
					var self = this;

					return self.checkForVisibility();
				}
			},
			methods: {
				setValue: function(value) {
					var self = this;

					if (value) {
						self.$parent.setValue(value);
						self.$forceUpdate();
					}
				},
				checkForVisibility: function() {
					var self = this;
					var parent = self.$parent;
					var response = false;

					if (typeof parent.searchTerm === 'undefined' && parent.$parent) {
						parent = parent.$parent;
						if (typeof parent.searchTerm === 'undefined' && parent.$parent) {
							parent = parent.$parent;
						}
					}

					if (self.option.name.toLowerCase().indexOf(parent.searchTerm.toLowerCase()) > -1) {
						response = true;
					} else if (self.$children) {
						for (let i = 0; i < self.$children.length; i++) {
							if (self.$children[i].checkForVisibility()) {
								response = true;
							}
						}
					} else {
						response = false;
					}

					return response;
				}
			}
		}
	},
	created: function() {
		var self = this;

		$('window').on('resize scroll', function() {
			self.reposition();
		});
	},
	watch: {
		active: function() {
			var self = this;

			if (self.active) {
				self.reposition();
			} else {
				self.searchTerm = '';
			}
		},
		filteredOptions: function() {
			var self = this;

			self.reposition();
		}
	},
	computed: {
		display: function() {
			var self = this;


			return self.getDisplayText() + self.caret;
		},
		caret: function() {
			var self = this;

			if (self.active) {
				return '<span class="fa fa-caret-up"></span>';
			}

			return '<span class="fa fa-caret-down"></span>';

		},
		filteredOptions: function() {
			var self = this;

			return self.returnFilteredOptions();
		}
	},
	methods: {
		returnFilteredOptions: function(options) {
			var self = this;
			if (typeof options === 'undefined') {
				var options = self.options;
			}
			var response = [];

			for (var i = 0; i < options.length; i++) {
				var option = options[i];

				if (option.name.length > 0 && option.name.toLowerCase().indexOf(self.searchTerm.toLowerCase()) > -1) {
					response.push(option);
				} else if (option.options) {
					var responseOption = $.extend({}, option);

					responseOption.options = self.returnFilteredOptions(responseOption.options);
					response.push(responseOption);
				}
			}

			return response;
		},
		setValue: function(value) {
			var self = this;
			var response;

			if (!self.multiple) {
				response = value;
				self.active = false;
			} else {
				if (!$.isArray(self.value)) {
					if (self.value.length > 0) {
						response = [self.value];
					} else {
						response = [];
					}
				} else {
					response = self.value;
				}
				if ($.isNumeric(value) || (typeof value !== 'string' && value.length > 0) || typeof value === 'string') {
					if ($.inArray(value, self.value) > -1) {
						response.splice(self.value.indexOf(value), 1);
					} else if (self.max == false || self.max > self.value.length) {
						response.push(value);
					}
				} else {
					response.push(value);
				}
			}
			self.$emit('input', response);
		},
		selectAll: function(options) {
			var self = this;

			if (self.multiple) {
				if (typeof options === 'undefined') {
					var options = self.options;
				}
				for (var i = 0; i < options.length; i++) {
					var value = options[i].id;

					if ($.inArray(value, self.value) == -1) {
						self.setValue(value);
					}

					if (options[i].options) {
						self.selectAll(options[i].options);
					}
				}
			}
		},
		selectFiltered: function() {
			var self = this;

			if (self.multiple) {
				self.selectAll(self.filteredOptions);
			}
		},
		selectOnlyFiltered: function() {
			var self = this;

			if (self.multiple) {
				self.setValue([]);
				self.selectAll(self.filteredOptions);
			}
		},
		deselectAll: function(option) {
			var self = this;

			if (self.multiple) {
				self.setValue([]);
			} else {
				self.setValue('');
			}
		},
		enable: function(option) {
			var self = this;

			self.disabled = false;
		},
		disable: function(option) {
			var self = this;

			self.disabled = true;
		},
		findOptionByID: function(id, options) {
			var self = this;

			if (typeof options === 'undefined') {
				var options = self.options;
			}
			for (var i = 0; i < options.length; i++) {
				if (options[i].id == id) {
					return options[i];
				} else if (options[i].options) {
					var childOption = self.findOptionByID(id, options[i].options);

					if (childOption) {
						return childOption;
					}
				}
			}
		},
		setVisible: function(boolean) {
			var self = this;

			self.disabled = boolean;
		},
		getDisplayText: function(options) {
			var self = this;

			if (typeof options === 'undefined') {
				var options = self.options;
			}
			if (self.value != '' || $.isNumeric(self.value) || $.isArray(self.value)) {
				var response;

				if (!self.multiple) {
					response = self.findOptionByID(self.value);
					if (typeof response !== 'undefined') {
						return response.name;
					}

					return '&nbsp;';

				}
				if (typeof self.value !== 'undefined' && self.value.length > 0) {
					response = [];
					for (var i = 0; i < self.value.length; i++) {
						response.push(self.findOptionByID(self.value[i]));
					}
					var count = false;

					if (self.displayformat.indexOf('>') > -1 && self.displayformat.replace(/^\D+/g, '').length > 0) {
						count = self.displayformat.replace(/^\D+/g, '');
					}
					if (self.displayformat == 'name' || (count !== false && self.value.length <= count)) {
						return response.map(function(option) {
							return option.name;
						}).join(', ');
					} else if (self.displayformat == 'id') {
						return response.map(function(option) {
							return option.id;
						}).join(', ');
					} else if (self.displayformat == 'count' || (count !== false && self.value.length > count)) {
						response = `${self.value.length} selected`;

						return response;
					}
				} else {
					return self.placeholder;
				}

			} else {
				return self.placeholder;
			}
		},
		startCloseDetection: function() {
			var self = this;

			$(window).one(`click.${self._uid}`, function(e) {
				var target = $(e.target);

				if (target.closest($(self.$el)).length === 0) {
					self.active = false;
				} else {
					self.startCloseDetection();
				}
			});
		},
		reposition: function() {
			var self = this;

			if (self.active) {
				Vue.nextTick(function() {
					var card = $(self.$el).find('.card')[0];
					var popper = new Popper(self.$el, card);

					$(card).css({'max-height': '30vh'});
					self.startCloseDetection();
				});
			}
		}
	}
});

