/*
// jQuery multiSelect
//
// Version 1.0 beta
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 06 April 2008
// Modified by Michael Scott, IQX Limited, January 2009, to include single select functionality operated by radio buttons, 
//    for a consistent look and feel on all controls
// No change in usage - it simply respects the presence or absence of the 'multiple' attribute of each <select> tag
// Only the noneSelected option is observed by a single select
//
// Visit http://abeautifulsite.net/notebook.php?article=62 for more information
//
// Usage: $('#control_id').multiSelect( options, callback )
//
// Options:  selectAll          - whether or not to display the Select All option; true/false, default = false
//           selectAllText      - text to display for selecting/unselecting all options simultaneously
//           noneSelected       - text to display when there are no selected items in the list
//           oneOrMoreSelected  - text to display when there are one or more selected items in the list
//                                (note: you can use % as a placeholder for the number of items selected).
//                                Use * to show a comma separated list of all selected; default = '% selected'
//
// Dependencies:  jQuery 1.2 or higher (http://jquery.com/)
//                the jQuery Dimensions plugin (http://plugins.jquery.com/project/dimensions)
//
// Licensing & Terms of Use
// 
// jQuery File Tree is licensed under a Creative Commons License and is copyrighted (C)2008 by Cory S.N. LaViska.
// For details, visit http://creativecommons.org/licenses/by/3.0/us/
//	
*/
if(jQuery) (function($){
	
	$.extend($.fn, {
		multiSelect: function(o, callback) {
			// Default options   (defaults changed by Michael Scott)
			if( !o ) var o = {};
			if( o.selectAll == undefined ) o.selectAll = false;
			if( o.selectAllText == undefined ) o.selectAllText = 'Select All';
			if( o.noneSelected == undefined ) o.noneSelected = '';
			if( o.oneOrMoreSelected == undefined ) o.oneOrMoreSelected = '*';
			
			// Initialize each multiSelect
			return this.each( function() {            
				var select = $(this);
				var inputType='radio';
				var singleSelect=true;
				var selectID=select.attr('id');
				var selectDummyName='dummy_'+select.attr('name'); // Validate plugin needs a name. One beginning with dummy_ will be ignored.
				var selectClass='';
				if (select.attr('multiple')) {
					singleSelect=false;
					inputType='checkbox';
					}
				if (selectID) {
					selectID=' id="'+selectID+'" ';
					}
				if (select.hasClass('required')) {
					selectClass+=' required'
					}
				if (select.hasClass('qpseudoquestanswer')) {
					selectClass+=' qpseudoquestanswer'
					}
				var html = '<input type="text" readonly="readonly" '+selectID+'name="'+selectDummyName+'" class="multiSelect'+selectClass+'" value="" style="cursor: default;" />';
				html += '<div class="multiSelectOptions" style="position: absolute; z-index: 99999; display: none;">';
				if( (o.selectAll || select.hasClass('SelectAllOption') ) && !singleSelect ) html += '<label class="selectAll"><input type="checkbox" class="selectAll" />' + o.selectAllText + '</label>';
				$(select).find('OPTION').each( function() {
					if( $(this).val() != '' ) {
						html += '<label><input type="' + inputType + '" name="' + $(select).attr('name') + '" value="' + $(this).val() + '"';
						if( $(this).attr('selected') ) html += ' checked="checked"';
						html += ' />' + $(this).html() + '</label>';
					}
				});
				html += '</div>';
				$(select).after(html);
				
				// Store the options for use by multiSelectUpdateSelected
				var newopt=$.extend({},o,{singleSelect:singleSelect});  // Clone the options object and add the singleSelect attribute
				$(select).next('.multiSelect').next('.multiSelectOptions').data('options',newopt);
				
				// Events
				$(select).next('.multiSelect').mouseover( function() {
					$(this).addClass('hover');
				}).mouseout( function() {
					$(this).removeClass('hover');
				}).click( function() {
					// Show/hide on click
					if( $(this).hasClass('active') ) {
						$(this).multiSelectOptionsHide();
					} else {
						$(this).multiSelectOptionsShow();
					}
					return false;
				}).focus( function() {
					// So it can be styled with CSS
					$(this).addClass('focus');
				}).blur( function() {
					// So it can be styled with CSS
					$(this).removeClass('focus');
				});
				
				if (!singleSelect){
					// Determine if Select All should be checked initially
					if( o.selectAll ) {
						var sa = true;
						$(select).next('.multiSelect').next('.multiSelectOptions').find('INPUT:checkbox').not('.selectAll').each( function() {
							if( !$(this).attr('checked') ) sa = false;
						});
						if( sa ) $(select).next('.multiSelect').next('.multiSelectOptions').find('INPUT.selectAll').attr('checked', true).parent().addClass('checked');
					}
					
					// Handle Select All
					$(select).next('.multiSelect').next('.multiSelectOptions').find('INPUT.selectAll').click( function() {
						if( $(this).attr('checked') ) $(this).parent().parent().find('INPUT:checkbox').attr('checked', true).parent().addClass('checked'); else $(this).parent().parent().find('INPUT:checkbox').attr('checked', false).parent().removeClass('checked');
					});
				}
				// Handle checkboxes/radio buttons
				$(select).next('.multiSelect').next('.multiSelectOptions').find('INPUT:'+inputType).click( function() {
					$(this).parent().parent().multiSelectUpdateSelected();
					$(this).parent().parent().find('LABEL').removeClass('checked').find('INPUT:checked').parent().addClass('checked');
					$(this).parent().parent().prev('.multiSelect').focus();
					if (singleSelect) {
						$(this).parent().parent().prev('INPUT.multiSelect').multiSelectOptionsHide();
					}
					else {
						if (!$(this).attr('checked')) 
							$(this).parent().parent().find('INPUT:checkbox.selectAll').attr('checked', false).parent().removeClass('checked');
					}
					if( callback ) callback($(this));
				});
				
				// Initial display
				$(select).next('.multiSelect').next('.multiSelectOptions').each( function() {
					$(this).multiSelectUpdateSelected();
					$(this).find('INPUT:checked').parent().addClass('checked');
				});
				
				// Handle hovers
				$(select).next('.multiSelect').next('.multiSelectOptions').find('LABEL').mouseover( function() {
					$(this).parent().find('LABEL').removeClass('hover');
					$(this).addClass('hover');
				}).mouseout( function() {
					$(this).parent().find('LABEL').removeClass('hover');
				});
				
				// Keyboard
				$(select).next('.multiSelect').keydown( function(e) {
					// Is dropdown visible?
					if( $(this).next('.multiSelectOptions').is(':visible') ) {
						// Dropdown is visible
						// Tab
						if( e.keyCode == 9 ) {
							$(this).addClass('focus').trigger('click'); // esc, left, right - hide
							$(this).focus().next(':input').focus();
							return true;
						}
						
						// ESC, Left, Right
						if( e.keyCode == 27 || e.keyCode == 37 || e.keyCode == 39 ) {
							// Hide dropdown
							$(this).addClass('focus').trigger('click');
						}
						// Down
						if( e.keyCode == 40 ) {
							if( !$(this).next('.multiSelectOptions').find('LABEL').hasClass('hover') ) {
								// Default to first item
								$(this).next('.multiSelectOptions').find('LABEL:first').addClass('hover');
							} else {
								// Move down, cycle to top if on bottom
								$(this).next('.multiSelectOptions').find('LABEL.hover').removeClass('hover').next('LABEL').addClass('hover');
								if( !$(this).next('.multiSelectOptions').find('LABEL').hasClass('hover') ) {
									$(this).next('.multiSelectOptions').find('LABEL:first').addClass('hover');
								}
							}
							return false;
						}
						// Up
						if( e.keyCode == 38 ) {
							if( !$(this).next('.multiSelectOptions').find('LABEL').hasClass('hover') ) {
								// Default to first item
								$(this).next('.multiSelectOptions').find('LABEL:first').addClass('hover');
							} else {
								// Move up, cycle to bottom if on top
								$(this).next('.multiSelectOptions').find('LABEL.hover').removeClass('hover').prev('LABEL').addClass('hover');
								if( !$(this).next('.multiSelectOptions').find('LABEL').hasClass('hover') ) {
									$(this).next('.multiSelectOptions').find('LABEL:last').addClass('hover');
								}
							}
							return false;
						}
						// Enter, Space
						if( e.keyCode == 13 || e.keyCode == 32 ) {
							// Select All  (does not apply to singleSelect)
							if( $(this).next('.multiSelectOptions').find('LABEL.hover INPUT:checkbox').hasClass('selectAll') ) {
								if( $(this).next('.multiSelectOptions').find('LABEL.hover INPUT:checkbox').attr('checked') ) {
									// Uncheck all
									$(this).next('.multiSelectOptions').find('INPUT:checkbox').attr('checked', false).parent().removeClass('checked');
								} else {
									// Check all
									$(this).next('.multiSelectOptions').find('INPUT:checkbox').attr('checked', true).parent().addClass('checked');
								}
								$(this).next('.multiSelectOptions').multiSelectUpdateSelected();
								if( callback ) callback($(this));
								return false;
							}
							// Other checkboxes/radio buttons
							if( $(this).next('.multiSelectOptions').find('LABEL.hover INPUT:'+inputType).attr('checked') ) {
								if (singleSelect) {
									//Already checked - nothing to do but close up
									$(this).multiSelectOptionsHide();
								}
								else {
									// Uncheck
									$(this).next('.multiSelectOptions').find('LABEL.hover INPUT:checkbox').attr('checked', false);
									$(this).next('.multiSelectOptions').multiSelectUpdateSelected();
									$(this).next('.multiSelectOptions').find('LABEL').removeClass('checked').find('INPUT:checked').parent().addClass('checked');
									// Select all status can't be checked at this point
									$(this).next('.multiSelectOptions').find('INPUT:checkbox.selectAll').attr('checked', false).parent().removeClass('checked');
								}
								if( callback ) callback($(this));
							} else {
								// Check
								$(this).next('.multiSelectOptions').find('LABEL.hover INPUT:'+inputType).attr('checked', true);
								$(this).next('.multiSelectOptions').multiSelectUpdateSelected();
								$(this).next('.multiSelectOptions').find('LABEL').removeClass('checked').find('INPUT:checked').parent().addClass('checked');
								if (singleSelect){
									$(this).multiSelectOptionsHide();
								}
								if( callback ) callback($(this));
							}
						}
						return false;
					} else {
						// Dropdown is not visible
						if( e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13 || e.keyCode == 32 ) { // down, enter, space - show
							// Show dropdown
							$(this).removeClass('focus').trigger('click');
							$(this).next('.multiSelectOptions').find('LABEL:first').addClass('hover');
							return false;
						}
						//  Tab key
						if( e.keyCode == 9 ) {
							// Shift focus to next INPUT element on page
							$(this).focus().next(':input').focus();
							return true;
						}
					}
					// Prevent enter key from submitting form
					if( e.keyCode == 13 ) return false;
				});
				
				// Eliminate the original form element
				$(select).remove();
			});
			
		},
		
		// Hide the dropdown - applied to input.multiSelect
		multiSelectOptionsHide: function() {
		  return this.each( function() {  
			$(this).removeClass('active').nextAll('.multiSelectOptions:first').hide();
		  });
		},
		
		// Show the dropdown - applied to input.multiSelect
		multiSelectOptionsShow: function() {
		  return this.each( function() {  
			// Hide any open option boxes
			$('.multiSelect').multiSelectOptionsHide();
			$(this).nextAll('.multiSelectOptions:first').find('LABEL').removeClass('hover');
			$(this).addClass('active').nextAll('.multiSelectOptions:first').show();
			
			// Position it
			var position = $(this).position();  // Changed from offset() to make it work correctly in dialogs - MHS 31/3/11
			$(this).nextAll('.multiSelectOptions:first').css({ top:  position.top + $(this).outerHeight() + 'px' });
			$(this).nextAll('.multiSelectOptions:first').css({ left: position.left + 'px' });
			
			// Disappear on hover out
			multiSelectCurrent = $(this);
			var timer = '';
			$(this).nextAll('.multiSelectOptions:first').hover( function() {
				clearTimeout(timer);
			}, function() {
				timer = setTimeout('$(multiSelectCurrent).multiSelectOptionsHide(); $(multiSelectCurrent).unbind("hover");', 250);
			});
			});
		},
		
		// Update the textbox - applied to div.multiSelectOptions
		multiSelectUpdateSelected: function() {
		  return this.each( function() {  
			var o=$(this).data('options');        
			if (o.singleSelect) {
				var display = '';
				$(this).find('INPUT:radio:checked').each( function() {     // Will only find one
					display = $(this).parent().text();
				});
				if (display == '') {
					$(this).prevAll('INPUT.multiSelect:first').val( o.noneSelected );
				}
				else {
					$(this).prevAll('INPUT.multiSelect:first').val(display);
				}
			}
			else {
				var i = 0, s = '';
				$(this).find('INPUT:checkbox:checked').not('.selectAll').each(function(){
					i++;
				});
				if (i == 0) {
					$(this).prevAll('INPUT.multiSelect:first').val(o.noneSelected);
				}
				else {
					if (o.oneOrMoreSelected == '*') {
						var display = '';
						$(this).find('INPUT:checkbox:checked').each(function(){
							if ($(this).parent().text() != o.selectAllText) 
								display = display + $(this).parent().text() + ', ';
						});
						display = display.substr(0, display.length - 2);
						$(this).prevAll('INPUT.multiSelect:first').val(display);
					}
					else {
						$(this).prevAll('INPUT.multiSelect:first').val(o.oneOrMoreSelected.replace('%', i));
					}
				}
			}
		  });
		}
		
	});
	
})(jQuery);