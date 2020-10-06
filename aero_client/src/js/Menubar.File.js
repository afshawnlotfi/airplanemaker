import { STLExporter } from './CustomExporters.js'
import { OBJExporter } from '../../examples/jsm/exporters/OBJExporter.js';
import { write_machup_analysis_json } from "./MU.js";
import { UIPanel, UIRow, UIHorizontalRule } from './libs/ui.js';





function MenubarFile( editor ) {

	function parseNumber( key, value ) {

		var precision = config.getKey( 'exportPrecision' );

		return typeof value === 'number' ? parseFloat( value.toFixed( precision ) ) : value;

	}

	//

	var config = editor.config;
	var strings = editor.strings;

	var container = new UIPanel();
	container.setClass( 'menu' );

	var title = new UIPanel();
	title.setClass( 'title' );
	title.setTextContent( strings.getKey( 'menubar/file' ) );
	container.add( title );

	var options = new UIPanel();
	options.setClass( 'options' );
	container.add( options );

	// New

	var option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/new' ) );
	option.onClick( function () {

		if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {

			editor.clear();
			editor.setupSceneObjects();

		}

	} );
	options.add( option );

	//

	options.add( new UIHorizontalRule() );

	// Import

	var form = document.createElement( 'form' );
	form.style.display = 'none';
	document.body.appendChild( form );

	var fileInput = document.createElement( 'input' );
	fileInput.multiple = true;
	fileInput.type = 'file';
	fileInput.addEventListener( 'change', function () {

		editor.loader.loadFiles( fileInput.files );
		form.reset();

	} );
	form.appendChild( fileInput );

	var option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/import' ) );
	option.onClick( function () {

		fileInput.click();

	} );
	options.add( option );

	//

	options.add( new UIHorizontalRule() );

	// Export Geometry

	var option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/geometry' ) );
	option.onClick( function () {

		var object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected.' );
			return;

		}

		var geometry = object.geometry;

		if ( geometry === undefined ) {

			alert( 'The selected object doesn\'t have geometry.' );
			return;

		}

		var output = geometry.toJSON();

		try {

			output = JSON.stringify( output, parseNumber, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		} catch ( e ) {

			output = JSON.stringify( output );

		}

		saveString( output, 'geometry.json' );

	} );
	options.add( option );

	// Export Object

	var option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/object' ) );
	option.onClick( function () {

		var object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected' );
			return;

		}

		var output = object.toJSON();

		try {

			output = JSON.stringify( output, parseNumber, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		} catch ( e ) {

			output = JSON.stringify( output );

		}

		saveString( output, 'model.json' );

	} );
	options.add( option );


	//


	// Export to MU Pro

	var option = new UIRow(); // DFH
	option.setClass( 'option' );
	option.setTextContent( 'Export to MU Pro' );
	option.onClick( function () {

		const filename = prompt( "Enter a filename", editor.scene.name );
		if ( filename != null ) {

			let output = write_machup_analysis_json( editor );
			output = JSON.stringify( output, null, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

			saveString( output, filename + ".json" );

		}

	} );
	options.add( option );

	//


	// Export Scene

	var option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/scene' ) );
	option.onClick( function () {

		var output = editor.scene.toJSON();

		try {

			output = JSON.stringify( output, parseNumber, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		} catch ( e ) {

			output = JSON.stringify( output );

		}

		saveString( output, 'scene.json' );

	} );
	options.add( option );

	//

	options.add( new UIHorizontalRule() );




	// Export OBJ

	var option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/obj' ) );
	option.onClick( function () {

		var object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected.' );
			return;

		}

		var exporter = new OBJExporter();

		saveString( exporter.parse( object ), 'model.obj' );

	} );
	options.add( option );



	// Export STL (ASCII)

	var option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/stl' ) );
	option.onClick( function () {

		var exporter = new STLExporter();

		saveString( exporter.parse( editor.scene ), 'model.stl' );

	} );
	options.add( option );


	//




	var link = document.createElement( 'a' );
	function save( blob, filename ) {

		link.href = URL.createObjectURL( blob );
		link.download = filename || 'data.json';
		link.dispatchEvent( new MouseEvent( 'click' ) );

		// URL.revokeObjectURL( url ); breaks Firefox...

	}

	function saveArrayBuffer( buffer, filename ) {

		save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );

	}

	function saveString( text, filename ) {

		save( new Blob( [ text ], { type: 'text/plain' } ), filename );

	}

	return container;

}

export { MenubarFile };
