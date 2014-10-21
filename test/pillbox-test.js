/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

define(function(require){
	var $ = require('jquery');
	var html = require('text!test/markup/pillbox-markup.html');

	require('bootstrap');
	require('fuelux/pillbox');

	module("Fuel UX Pillbox");

	test("should be defined on jquery object", function () {
		ok($().find('#MyPillbox').pillbox, 'pillbox method is defined');
	});

	test("should return element", function () {
		var $pillbox = $(html).find('#MyPillbox');
		ok($pillbox.pillbox() === $pillbox, 'pillbox is initialized');
	});

	test("should behave as designed", function () {
		var $pillbox = $(html).find('#MyPillbox').pillbox();

		equal($pillbox.pillbox('items').length, 5, 'pillbox returns both items');

		$pillbox.find('li > span:last').click();

		equal($pillbox.pillbox('items').length, 4, 'pillbox removed an item');
		equal($pillbox.pillbox('items')[0].name, 'Item 1', 'pillbox returns item name property');
		equal($pillbox.pillbox('items')[0].text, 'Item 1', 'pillbox returns item text property');
		equal($pillbox.pillbox('items')[0].value, 'foo', 'pillbox returns item value');
	});

	test("Input functionality should behave as designed", function () {
		var $pillbox = $(html).find('#MyPillbox').pillbox();
		var $input = $pillbox.find('.pillbox-add-item');

		$input.val('three-value');
		$input.trigger($.Event( "keydown", { keyCode: 13 } ));

		equal($pillbox.pillbox('items')[5].name, 'three-value', 'pillbox returns added item name property');
		equal($pillbox.pillbox('items')[5].text, 'three-value', 'pillbox returns added item text property');
		equal($pillbox.pillbox('items')[5].value, 'three-value', 'pillbox returns added item value');
	});

	test("itemCount function", function(){
		var $pillbox = $(html).find('#MyPillboxEmpty').pillbox();

		equal($pillbox.pillbox('itemCount'), 0, 'itemCount on empty pillbox');

		$pillbox = $(html).find('#MyPillbox').pillbox();

		equal($pillbox.pillbox('itemCount'), 5, 'itemCount on pillbox with 5 items');
	});

	test("addItems/removeItems functions", function(){
		var $pillbox = $(html).find('#MyPillboxEmpty').pillbox();

		equal($pillbox.pillbox('itemCount'), 0, 'pillbox is initially empty');

		$pillbox.pillbox('addItems',
			{
				name: 'Item 1',
				value: 1,
				attr: {
					'cssClass': 'example-pill-class',
					'style': 'background-color: #0000FF',
					'data-example-attribute': true
				}
			});
		equal($pillbox.pillbox('items')[0].name, 'Item 1', 'single item added has correct name');
		equal($pillbox.pillbox('items')[0].text, 'Item 1', 'single item added has correct text');
		equal($pillbox.pillbox('items')[0].value, 1, 'single item added has correct value');
		equal($pillbox.pillbox('items')[0].exampleAttribute, true, 'single item added has correct data');


		$pillbox.pillbox('addItems', { text: 'Item 2' });
		equal($pillbox.pillbox('items')[1].text, 'Item 2', 'single item added has correct text');

		$pillbox.pillbox('removeItems');
		equal($pillbox.pillbox('items').length, 0, 'removedItems removed all items');

		$pillbox.pillbox('addItems', {name:'Item 1', value:1},{name:'Item 2', value:2});
		equal($pillbox.pillbox('items')[1].name, 'Item 2', 'multiple items added have correct name');
		equal($pillbox.pillbox('items')[1].value, 2, 'multiple items added have correct value');

		$pillbox.pillbox('addItems', {text:'Item 3'},{text:'Item 4'});
		equal($pillbox.pillbox('items')[3].text, 'Item 4', 'multiple items added have correct text');

		$pillbox.pillbox('removeItems');

		$pillbox.pillbox('addItems', [{name:'Item 1', value:1},{name:'Item 2', value:2},{name:'Item 3', value:3},{text:'Item 4', value:4}]);
		equal($pillbox.pillbox('items')[2].name, 'Item 3', 'multiple items added by array have correct name');
		equal($pillbox.pillbox('items')[2].value, '3', 'multiple items added by array have correct value');
		equal($pillbox.pillbox('items')[3].text, 'Item 4', 'multiple items added by array have correct text');

		$pillbox.pillbox('removeItems',2,1);
		equal($pillbox.pillbox('items')[1].name, 'Item 3' ,'single item has been removed at the correct index');

		$pillbox.pillbox('removeItems',1);
		equal($pillbox.pillbox('items')[0].name, 'Item 3' ,'single item has been removed at the correct index');
	});

	test("removeByValue function", function(){
		var $pillbox = $(html).find('#MyPillbox').pillbox();

		equal($pillbox.pillbox('itemCount'), 5, 'pillbox has 5 items initially');

		$pillbox.pillbox('removeByValue', 'foo');

		equal($pillbox.pillbox('itemCount'), 4, 'pillbox has 4 items after removeByValue');
		equal($pillbox.pillbox('items')[0].name, 'Item 2', 'item not removed has correct name');
	});

	// This is a legacy function kept for backwards compatibility from changing TEXT key name to NAME
	test("removeByText function", function(){
		var $pillbox = $(html).find('#MyPillbox').pillbox();

		equal($pillbox.pillbox('itemCount'), 5, 'pillbox has 5 items initially');

		$pillbox.pillbox('removeByText', 'Item 2');

		equal($pillbox.pillbox('itemCount'), 4, 'pillbox has 4 items after removeByText');
		equal($pillbox.pillbox('items')[0].name, 'Item 1', 'item not removed has correct name');
	});

	test("removeByName function", function(){
		var $pillbox = $(html).find('#MyPillbox').pillbox();

		equal($pillbox.pillbox('itemCount'), 5, 'pillbox has 5 items initially');

		$pillbox.pillbox('removeByName', 'Item 2');

		equal($pillbox.pillbox('itemCount'), 4, 'pillbox has 4 items after removeByText');
		equal($pillbox.pillbox('items')[0].name, 'Item 1', 'item not removed has correct name');
	});

	test("all user defined methods work as expected", function(){
		var $pillbox = $(html).find('#MyPillbox').pillbox({
			onAdd: function(data,callback){
				callbackTriggers++;
				callback(data);
			},
			onKeyDown: function( data, callback ){
				callbackTriggers++;
				callback({data:[
					{name: 'Item 3',value:'three-value'}
				]});
			},
			onRemove: function(data,callback){
				callbackTriggers++;
				callback(data);
			}
		});
		var $input = $pillbox.find('.pillbox-add-item');
		var callbackTriggers = 0;

		$input.val('anything');
		$input.trigger($.Event( "keydown", { keyCode: 13 } ));	//enter
		equal(callbackTriggers, 1, 'onAdd triggered correctly');
		equal($pillbox.pillbox('items')[2].name, 'Item 3', 'item correctly added after onAdd user callback');

		$input.trigger($.Event( "keydown", { keyCode: 97 } ));	// number 1
		equal(callbackTriggers, 2, 'onKeyDown triggered correctly');

		$pillbox.find('> li > .glyphicon-close').click();
		equal(callbackTriggers, 2, 'onRemove triggered correctly');
		equal($pillbox.pillbox('items')[2].name, 'Item 3', 'item correctly added after onAdd user callback');

	});

	test("Suggestions functionality should behave as designed", function () {
		var $pillbox = $(html).find('#MyPillboxEmpty').pillbox({
			onKeyDown: function( data, callback ){
				callback({data:[
					{ name: 'Acai', value:  'acai' },
					{ name: 'African cherry orange', value:  'african cherry orange' },
					{ name: 'Banana', value:  'banana' },
					{ name: 'Bilberry', value:  'bilberry' },
					{ name: 'Cantaloupe', value:  'cantaloupe' },
					{ name: 'Ceylon gooseberry', value:  'ceylon gooseberry' },
					{ name: 'Dragonfruit', value:  'dragonfruit' },
					{ name: 'Dead Man\'s Fingers', value:  'dead man\'s fingers' },
					{ name: 'Fig', value:  'fig' },
					{ name: 'Forest strawberries', value:  'forest strawberries' },
					{ name: 'Governor’s Plum', value:  'governor’s plum' },
					{ name: 'Grapefruit', value:  'grapefruit' },
					{ name: 'Guava', value:  'guava' },
					{ name: 'Honeysuckle', value:  'honeysuckle' },
					{ name: 'Huckleberry', value:  'huckleberry' },
					{ name: 'Jackfruit', value:  'jackfruit' },
					{ name: 'Japanese Persimmon', value:  'japanese persimmon' },
					{ name: 'Key Lime', value:  'key lime' },
					{ name: 'Kiwi', value:  'kiwi' },
					{ name: 'Lemon', value:  'lemon' },
					{ name: 'Lillypilly', value:  'lillypilly' },
					{ name: 'Mandarin', value:  'mandarin' },
					{ name: 'Miracle Fruit', value:  'miracle fruit' },
					{ name: 'Orange', value:  'orange' },
					{ name: 'Oregon grape', value:  'oregon grape' },
					{ name: 'Persimmon', value:  'persimmon' },
					{ name: 'Pomegranate', value:  'pomegranate' },
					{ name: 'Rhubarb', value:  'rhubarb' },
					{ name: 'Rose hip', value:  'rose hip' },
					{ name: 'Soursop', value:  'soursop' },
					{ name: 'Starfruit', value:  'starfruit' },
					{ name: 'Tamarind', value:  'tamarind' },
					{ name: 'Thimbleberry', value:  'thimbleberry' },
					{ name: 'Wineberry', value:  'wineberry' },
					{ name: 'Wongi', value:  'wongi' },
					{ name: 'Youngberry', value: 'youngberry' }
				]});
			}
		});
		var $input = $pillbox.find('.pillbox-add-item');

		$input.trigger( $.Event( "keydown", { keyCode: 97 } ) ); // numpad 1
		$pillbox.find('.suggest > li').trigger('mousedown');
		equal($pillbox.pillbox('items')[0].name, 'Acai' , 'pillbox returns item added after user clicks suggestion');

		$input.val('');
		$input.trigger( $.Event( "keydown", { keyCode: 97 } ) ); // numpad 1
		$input.trigger( $.Event( "keydown", { keyCode: 40 } ) ); // down
		$input.trigger( $.Event( "keydown", { keyCode: 13 } ) ); // enter
		equal($pillbox.pillbox('items')[1].name, 'Acai', 'pillbox returns item added after user keys down to suggestions');

		$input.val('');
		$input.trigger( $.Event( "keydown", { keyCode: 97 } ) ); // numpad 1
		$input.trigger( $.Event( "keydown", { keyCode: 38 } ) ); // up
		$input.trigger( $.Event( "keydown", { keyCode: 13 } ) ); // enter

		equal($pillbox.pillbox('items')[2].name, 'Acai', 'pillbox returns item added after user keys up to suggestion');

		$input.val('');
		$input.trigger( $.Event( "keydown", { keyCode: 97 } ) ); // numpad 1
		$input.trigger( $.Event( "keydown", { keyCode: 9 } ) ); // tab
		$input.trigger( $.Event( "keydown", { keyCode: 13 } ) ); // enter
		equal($pillbox.pillbox('items')[3].name, 'Acai', 'pillbox returns item added after user tabs down to suggestion');

		equal($pillbox.pillbox('items').length, 4, 'pillbox has correct number of items');
	});

	test("Edit functionality should behave as designed", function () {
		var $pillbox = $(html).find('#MyPillbox').pillbox({
			edit: true
		});
		var $ul = $pillbox.find('.pill-group');
		var $input = $pillbox.find('.pillbox-add-item');

		$pillbox.find('.pill-group > li:first span:first').click();
		equal($ul.children().eq(0).hasClass('pillbox-input-wrap'), true, 'pillbox item enters edit mode');

		$input.trigger('blur');
		equal($ul.children().eq(0).hasClass('pillbox-input-wrap'), false, 'pillbox item exits edit mode');

		$pillbox.find('.pill-group > li:first span:first').click();
		$input.val('test edit');
		$input.trigger( $.Event( "keydown", { keyCode: 13 } ) );
		equal($pillbox.pillbox('items')[0].name, 'test edit', 'pillbox item name was able to be edited');
		equal($pillbox.pillbox('items')[0].value, 'test edit', 'pillbox item value is correct after edit');
	});

	test("Triggers behave as designed", function () {
		var $pillbox = $(html).find('#MyPillbox').pillbox({ edit: true });
		var $input = $pillbox.find('.pillbox-add-item');

		$pillbox.on('clicked.fu.pillbox', function( ev, item ){
			equal(item.name, 'Item 1', 'clicked event is triggered');
		});
		$pillbox.find('> ul > li:first span:first').click();
		$pillbox.off('clicked.fu.pillbox');

		$pillbox.on('added.fu.pillbox', function( ev, item ){
			equal(item.name, 'added test', 'added event is triggered');
		});
		$input.val('added test');
		$input.trigger( $.Event( "keydown", { keyCode: 13 } ) );
		$pillbox.off('added.fu.pillbox');

		$pillbox.on('removed.fu.pillbox', function( ev, item ){
			equal(item.name, 'added test', 'removed event is triggered');
		});
		$pillbox.find('> ul > li:first > span:last').click();
		$pillbox.off('removed.fu.pillbox');

		$pillbox = $(html).pillbox({edit: true});
		$pillbox.on('edited.fu.pillbox', function( ev, item ){
			equal(item.name, 'edit test', 'edit event is triggered');
		});
		$pillbox.find('> ul > li:first').click();
		$input.val('edit test');
		$input.trigger( $.Event( "keydown", { keyCode: 13 } ) );
	});

	test("Readonly behaves as designed", function () {
		var $pillbox;

		$pillbox = $(html).find('#MyPillbox');
		$pillbox.attr('data-readonly', 'readonly');
		$pillbox.pillbox();
		$pillbox.find('.pill:last > span:last').click();
		equal($pillbox.pillbox('items').length, 5, 'pillbox correctly in readonly mode via data api');

		$pillbox = $(html).find('#MyPillbox');
		$pillbox.pillbox({ readonly: true });
		$pillbox.find('.pill:last > span:last').click();
		equal($pillbox.pillbox('items').length, 5, 'pillbox correctly in readonly mode via init option');

		$pillbox.pillbox('readonly', false);
		$pillbox.find('.pill:last > span:last').click();
		equal($pillbox.pillbox('items').length, 4, 'pillbox readonly mode disabled via method as appropriate');

		$pillbox.pillbox('readonly', true);
		$pillbox.find('.pill:last > span:last').click();
		equal($pillbox.pillbox('items').length, 4, 'pillbox readonly mode enabled via method as appropriate');
	});

	//TODO: how can I test this one properly? O.o
	test("Truncate behaves as designed", function () {
		var $pillbox;

		$pillbox = $(html).find('#MyPillbox');
		$pillbox.width(100);
		$('body').append($pillbox);
		$pillbox.pillbox({ readonly: true, truncate: true });
		equal($pillbox.find('.pill.truncated').length, 5, 'pillbox truncate functioning correctly while in readonly');

		$pillbox.pillbox('readonly', false);
		equal($pillbox.find('.pill.truncated').length, 0, 'pillbox truncate not enabled while not readonly');
		$pillbox.remove();
	});

	test("should destroy control", function () {
		var $el = $(html).find('#MyPillbox');

		equal(typeof( $el.pillbox('destroy')) , 'string', 'returns string (markup)');
		equal( $el.parent().length, false, 'control has been removed from DOM');
	});

});








