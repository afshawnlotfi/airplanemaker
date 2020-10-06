import { UIPanel, UINumber, UISelect, UIButton, UIText, UIRow, UIHorizontalRule } from './libs/ui.js';
import { updateCondition } from './Sidebar.Condition.js';
import { calculate_reference_values, runAnalysis, analysis } from './MU.js';

//Units for weight and trim values must be outside sidebar.analysis function so that they can be accessed by updateCondition function.
var Ltrim_units = new UIText( '' ).setWidth( '25 px' );
var mtrim_units = new UIText( '' ).setWidth( '25 px' );
var weight_units = new UIText( '' ).setWidth( '25 px' );

// eslint-disable-next-line prefer-const
let doSave = 0;

export const getDoSave = () => {

	return doSave;

};

export const setDoSave = ( d ) => {

	doSave = d;

};




let editor = undefined;

function SidebarAnalysis( _editor ) {

	editor = _editor;
	var saveAs = saveAs || typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind( navigator ) || function ( view ) {

		"use strict"; if ( typeof navigator !== "undefined" && /MSIE [1-9]\./.test( navigator.userAgent ) ) {

			return;

		}

		var doc = view.document, get_URL = function () {

				return view.URL || view.webkitURL || view;

			}, save_link = doc.createElementNS( "http://www.w3.org/1999/xhtml", "a" ), can_use_save_link = "download" in save_link, click = function ( node ) {

				var event = doc.createEvent( "MouseEvents" ); event.initMouseEvent( "click", true, false, view, 0, 0, 0, 0, 0, false, false, false, false, 0, null ); node.dispatchEvent( event );

			}, webkit_req_fs = view.webkitRequestFileSystem, req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem, throw_outside = function ( ex ) {

				( view.setImmediate || view.setTimeout )( function () {

					throw ex;

				}, 0 );

			}, force_saveable_type = "application/octet-stream", fs_min_size = 0, arbitrary_revoke_timeout = 500, revoke = function ( file ) {

				var revoker = function () {

					if ( typeof file === "string" ) {

						get_URL().revokeObjectURL( file );

					} else {

						file.remove();

					}

				};

				if ( view.chrome ) {

					revoker();

				} else {

					setTimeout( revoker, arbitrary_revoke_timeout );

				}

			}, dispatch = function ( filesaver, event_types, event ) {

				event_types = [].concat( event_types ); var i = event_types.length; while ( i -- ) {

					var listener = filesaver[ "on" + event_types[ i ] ]; if ( typeof listener === "function" ) {

						try {

							listener.call( filesaver, event || filesaver );

						} catch ( ex ) {

							throw_outside( ex );

						}

					}

				}

			}, FileSaver = function ( blob, name ) {

				var filesaver = this, type = blob.type, blob_changed = false, object_url, target_view, dispatch_all = function () {

						dispatch( filesaver, "writestart progress write writeend".split( " " ) );

					}, fs_error = function () {

						if ( blob_changed || ! object_url ) {

							object_url = get_URL().createObjectURL( blob );

						}

						if ( target_view ) {

							target_view.location.href = object_url;

						} else {

							var new_tab = view.open( object_url, "_blank" ); if ( new_tab == undefined && typeof safari !== "undefined" ) {

								view.location.href = object_url;

							}

						}

						filesaver.readyState = filesaver.DONE; dispatch_all(); revoke( object_url );

					}, abortable = function ( func ) {

						return function () {

							if ( filesaver.readyState !== filesaver.DONE ) {

								return func.apply( this, arguments );

							}

						};

					}, create_if_not_found = { create: true, exclusive: false }, slice; filesaver.readyState = filesaver.INIT; if ( ! name ) {

					name = "download";

				}

				if ( can_use_save_link ) {

					object_url = get_URL().createObjectURL( blob ); save_link.href = object_url; save_link.download = name; click( save_link ); filesaver.readyState = filesaver.DONE; dispatch_all(); revoke( object_url ); return;

				}

				if ( view.chrome && type && type !== force_saveable_type ) {

					slice = blob.slice || blob.webkitSlice; blob = slice.call( blob, 0, blob.size, force_saveable_type ); blob_changed = true;

				}

				if ( webkit_req_fs && name !== "download" ) {

					name += ".download";

				}

				if ( type === force_saveable_type || webkit_req_fs ) {

					target_view = view;

				}

				if ( ! req_fs ) {

					fs_error(); return;

				}

				fs_min_size += blob.size; req_fs( view.TEMPORARY, fs_min_size, abortable( function ( fs ) {

					fs.root.getDirectory( "saved", create_if_not_found, abortable( function ( dir ) {

						var save = function () {

							dir.getFile( name, create_if_not_found, abortable( function ( file ) {

								file.createWriter( abortable( function ( writer ) {

									writer.onwriteend = function ( event ) {

										target_view.location.href = file.toURL(); filesaver.readyState = filesaver.DONE; dispatch( filesaver, "writeend", event ); revoke( file );

									};

									writer.onerror = function () {

										var error = writer.error; if ( error.code !== error.ABORT_ERR ) {

											fs_error();

										}

									};

									"writestart progress write abort".split( " " ).forEach( function ( event ) {

										writer[ "on" + event ] = filesaver[ "on" + event ];

									} ); writer.write( blob ); filesaver.abort = function () {

										writer.abort(); filesaver.readyState = filesaver.DONE;

									};

									filesaver.readyState = filesaver.WRITING;

								} ), fs_error );

							} ), fs_error );

						};

						dir.getFile( name, { create: false }, abortable( function ( file ) {

							file.remove(); save();

						} ), abortable( function ( ex ) {

							if ( ex.code === ex.NOT_FOUND_ERR ) {

								save();

							} else {

								fs_error();

							}

						} ) );

					} ), fs_error );

				} ), fs_error );

			}, FS_proto = FileSaver.prototype, saveAs = function ( blob, name ) {

				return new FileSaver( blob, name );

			};

		FS_proto.abort = function () {

			var filesaver = this; filesaver.readyState = filesaver.DONE; dispatch( filesaver, "abort" );

		};

		FS_proto.readyState = FS_proto.INIT = 0; FS_proto.WRITING = 1; FS_proto.DONE = 2; FS_proto.error = FS_proto.onwritestart = FS_proto.onprogress = FS_proto.onwrite = FS_proto.onabort = FS_proto.onerror = FS_proto.onwriteend = null; return saveAs;

	}( typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content ); if ( typeof module !== "undefined" && module.exports ) {

		module.exports.saveAs = saveAs;

	} else if ( typeof define !== "undefined" && define !== null && define.amd != null ) {

		define( [], function () {

			return saveAs;

		} );

	}


	var inputs = {};
	inputs.Ltrim = 0.0;
	inputs.mtrim = 0.0;
	inputs.weight = 10.0;

	doSave = 0;

	var container = new UIPanel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );

	// Run type
	var runRow = new UIRow();
	var runType = new UISelect().setOptions( {

		'forces': 'Forces and Moments',
		'derivatives': 'Performance Derivatives',
		'aerocenter': 'Aerodynamic Center',
		'stallonset': 'Stall Onset',
		'stallairspeed': 'Stall Airspeed',
		'targetl': 'Target Lift',
		'pitchtrim': 'Pitch Trim',
		'distributions': 'Distributions'

	} ).setWidth( '175px' ).setColor( '#000' ).setFontSize( '12px' );
	runType.onChange( update );
	runRow.add( new UIText( 'Run' ).setWidth( '80px' ) );
	runRow.add( runType );
	container.add( runRow );
	runType.setValue( 'forces' );

	//Trim
	// L
	var LtrimRow = new UIRow();
	var Ltrim = new UINumber( inputs.Ltrim ).setWidth( '70px' ).onChange( update );
	LtrimRow.add( new UIText( 'Target Lift' ).setWidth( '140px' ) );
	LtrimRow.add( Ltrim );
	LtrimRow.add( Ltrim_units );
	container.add( LtrimRow );
	LtrimRow.setDisplay( 'none' );

	// m
	var mtrimRow = new UIRow();
	var mtrim = new UINumber( inputs.mtrim ).setWidth( '70px' ).onChange( update );
	mtrimRow.add( new UIText( 'Target Moment' ).setWidth( '140px' ) );
	mtrimRow.add( mtrim );
	mtrimRow.add( mtrim_units );
	container.add( mtrimRow );
	mtrimRow.setDisplay( 'none' );

	//stall airspeed
	// Weight
	var weightRow = new UIRow();
	var weight = new UINumber( inputs.weight ).setWidth( '70px' ).onChange( update );
	weightRow.add( new UIText( 'Weight' ).setWidth( '140px' ) );
	weightRow.add( weight );
	weightRow.add( weight_units );
	container.add( weightRow );
	weightRow.setDisplay( 'none' );

	// Solver
	/*	var solverRow = new UIPanel();
	var solverType = new UISelect().setOptions( {

		'linear':  'Linear',
		'nonlinear': 'Nonlinear'

	} ).setWidth( '100px' ).setColor( '#888' ).setFontSize( '12px' )
	solverType.onChange( update );
	solverRow.add( new UIText( 'Solver' ).setWidth( '80px' ) );
	solverRow.add( solverType );
	container.add( solverRow );
    solverType.setValue( analysis.solver.type );
*/

	// --------------------------------------
	container.add( new UIHorizontalRule() );

	// update
	var updateRow = new UIRow();
	var updateButton = new UIButton( 'Update Results' ).onClick( updateResults );
	updateRow.add( new UIText( '' ).setWidth( '10px' ) );
	updateRow.add( updateButton );
	//	container.add( updateRow );

	// save
	var saveButton = new UIButton( 'Save Results' ).onClick( saveResults );
	updateRow.add( new UIText( '' ).setWidth( '5px' ) );
	updateRow.add( saveButton );
	container.add( updateRow );

	//-------------------
	// Display reference values
	//-------------------
	// Area
	var areaRow = new UIRow();
	var area = new UIText().setWidth( '50px' ).setColor( '#888' ).setFontSize( '12px' );
	var area_units = new UIText( '' ).setWidth( '25 px' );
	areaRow.add( new UIText( 'Reference Area' ).setWidth( '140px' ) );
	areaRow.add( area );
	areaRow.add( area_units );
	container.add( areaRow );

	// Long. Length
	var longLenRow = new UIRow();
	var long_len = new UIText().setWidth( '50px' ).setColor( '#888' ).setFontSize( '12px' );
	var long_len_units = new UIText( '' ).setWidth( '25px' );
	longLenRow.add( new UIText( 'Longitudinal Length' ).setWidth( '140px' ) );
	longLenRow.add( long_len );
	longLenRow.add( long_len_units );
	container.add( longLenRow );

	// Lateral Length
	var latLenRow = new UIRow();
	var lat_len = new UIText().setWidth( '50px' ).setColor( '#888' ).setFontSize( '12px' );
	var lat_len_units = new UIText( '' ).setWidth( '25px' );
	latLenRow.add( new UIText( 'Lateral Length' ).setWidth( '140px' ) );
	latLenRow.add( lat_len );
	latLenRow.add( lat_len_units );
	container.add( latLenRow );

	// --------------------------------------
	container.add( new UIHorizontalRule() );

	//-------------------
	// Display for forces
	//-------------------

	//Wing Forces
	var wingRow = new UIRow();

	var wing_label_row = new UIRow();
	var wing_forces_label = new UIText( 'Lifting Surface Results' );
	wing_label_row.add( wing_forces_label );
	wingRow.add( wing_label_row );

	// Wing Lift
	var WLRow = new UIRow().setMarginLeft( '10px' );
	var WL_units = new UIText( '' ).setWidth( '25 px' );
	var WL = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	WLRow.add( new UIText( 'Lift = ' ).setWidth( '140px' ) );
	WLRow.add( WL );
	WLRow.add( WL_units );
	wingRow.add( WLRow );

	// Wing Drag
	var WDRow = new UIRow().setMarginLeft( '10px' );
	var WD_units = new UIText( '' ).setWidth( '25 px' );
	var WD = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	WDRow.add( new UIText( 'Drag = ' ).setWidth( '140px' ) );
	WDRow.add( WD );
	WDRow.add( WD_units );
	wingRow.add( WDRow );

	// Wing Lift/Drag
	var WLDRow = new UIRow().setMarginLeft( '10px' );
	var WLD = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	WLDRow.add( new UIText( 'L/D = ' ).setWidth( '140px' ) );
	WLDRow.add( WLD );
	wingRow.add( WLDRow );

	container.add( wingRow );
	wingRow.setDisplay( 'none' );


	//Prop Forces
	var propRow = new UIRow();

	var prop_label_row = new UIRow();
	var prop_forces_label = new UIText( 'Prop Results' );
	prop_label_row.add( prop_forces_label );
	propRow.add( prop_label_row );

	// Prop Thrust
	var PTRow = new UIRow().setMarginLeft( '10px' );
	var PT_units = new UIText( '' ).setWidth( '25 px' );
	var PT = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	PTRow.add( new UIText( 'Thrust = ' ).setWidth( '140px' ) );
	PTRow.add( PT );
	PTRow.add( PT_units );
	propRow.add( PTRow );

	// Prop Torque
	var PlRow = new UIRow().setMarginLeft( '10px' );
	var Pl_units = new UIText( '' ).setWidth( '25 px' );
	var Pl = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	PlRow.add( new UIText( 'Torque = ' ).setWidth( '140px' ) );
	PlRow.add( Pl );
	PlRow.add( Pl_units );
	propRow.add( PlRow );

	container.add( propRow );
	propRow.setDisplay( 'none' );

	//Total Forces and Moments
	var totalRow = new UIRow();

	var total_label_row = new UIRow();
	var total_label = new UIText( 'Total Results' );
	total_label_row.add( total_label );
	totalRow.add( total_label_row );

	// FL
	var FLRow = new UIRow().setMarginLeft( '10px' );
	var FL_units = new UIText( '' ).setWidth( '25 px' );
	var FL = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	FLRow.add( new UIText( 'FL = ' ).setWidth( '140px' ) );
	FLRow.add( FL );
	FLRow.add( FL_units );
	totalRow.add( FLRow );
	//FLRow.setDisplay( 'none' );

	// FD
	var FDRow = new UIRow().setMarginLeft( '10px' );
	var FD_units = new UIText( '' ).setWidth( '25 px' );
	var FD = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	FDRow.add( new UIText( 'FD = ' ).setWidth( '140px' ) );
	FDRow.add( FD );
	FDRow.add( FD_units );
	totalRow.add( FDRow );
	//FDRow.setDisplay( 'none' );

	// FS
	var FSRow = new UIRow().setMarginLeft( '10px' );
	var FS_units = new UIText( '' ).setWidth( '25 px' );
	var FS = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	FSRow.add( new UIText( 'FS = ' ).setWidth( '140px' ) );
	FSRow.add( FS );
	FSRow.add( FS_units );
	totalRow.add( FSRow );
	//FSRow.setDisplay( 'none' );

	// MX
	var MXRow = new UIRow().setMarginLeft( '10px' );
	var MX_units = new UIText( '' ).setWidth( '25 px' );
	var MX = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	MXRow.add( new UIText( 'MX = ' ).setWidth( '140px' ) );
	MXRow.add( MX );
	MXRow.add( MX_units );
	totalRow.add( MXRow );
	//MXRow.setDisplay( 'none' );

	// MY
	var MYRow = new UIRow().setMarginLeft( '10px' );
	var MY_units = new UIText( '' ).setWidth( '25 px' );
	var MY = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	MYRow.add( new UIText( 'MY = ' ).setWidth( '140px' ) );
	MYRow.add( MY );
	MYRow.add( MY_units );
	totalRow.add( MYRow );
	//MYRow.setDisplay( 'none' );

	// MZ
	var MZRow = new UIRow().setMarginLeft( '10px' );
	var MZ_units = new UIText( '' ).setWidth( '25 px' );
	var MZ = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	MZRow.add( new UIText( 'MZ = ' ).setWidth( '140px' ) );
	MZRow.add( MZ );
	MZRow.add( MZ_units );
	totalRow.add( MZRow );
	//MZRow.setDisplay( 'none' );

	container.add( totalRow );
	totalRow.setDisplay( 'none' );

	//------------------------
	// Display for derivatives
	//------------------------
	var derivNote = new UIRow().setMarginLeft( '10px' );
	derivNote.add( new UIText( '      All Units = 1/rad' ).setWidth( '140px' ) );
	container.add( derivNote );
	derivNote.setDisplay( 'none' );

	// CL,alpha
	var CLaRow = new UIRow().setMarginLeft( '10px' );
	var CLa = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	CLaRow.add( new UIText( 'CL,alpha = ' ).setWidth( '140px' ) );
	CLaRow.add( CLa );
	container.add( CLaRow );
	CLaRow.setDisplay( 'none' );

	// CD,alpha
	var CDaRow = new UIRow().setMarginLeft( '10px' );
	var CDa = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	CDaRow.add( new UIText( 'CD,alpha = ' ).setWidth( '140px' ) );
	CDaRow.add( CDa );
	container.add( CDaRow );
	CDaRow.setDisplay( 'none' );

	// Cm,alpha
	var CmaRow = new UIRow().setMarginLeft( '10px' );
	var Cma = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	CmaRow.add( new UIText( 'Cm,alpha = ' ).setWidth( '140px' ) );
	CmaRow.add( Cma );
	container.add( CmaRow );
	CmaRow.setDisplay( 'none' );

	// CY,beta
	var CSbRow = new UIRow().setMarginLeft( '10px' );
	var CSb = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	CSbRow.add( new UIText( 'CS,beta = ' ).setWidth( '140px' ) );
	CSbRow.add( CSb );
	container.add( CSbRow );
	CSbRow.setDisplay( 'none' );

	// Cl,beta
	var ClbRow = new UIRow().setMarginLeft( '10px' );
	var Clb = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	ClbRow.add( new UIText( 'Cl,beta = ' ).setWidth( '140px' ) );
	ClbRow.add( Clb );
	container.add( ClbRow );
	ClbRow.setDisplay( 'none' );

	// Cn,beta
	var CnbRow = new UIRow().setMarginLeft( '10px' );
	var Cnb = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	CnbRow.add( new UIText( 'Cn,beta = ' ).setWidth( '140px' ) );
	CnbRow.add( Cnb );
	container.add( CnbRow );
	CnbRow.setDisplay( 'none' );

	// Static Margin
	var smRow = new UIRow().setMarginLeft( '10px' );
	var sm = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	smRow.add( new UIText( 'Static Margin = ' ).setWidth( '140px' ) );
	smRow.add( sm );
	container.add( smRow );
	smRow.setDisplay( 'none' );

	//------------------------
	// Display for aerocenter
	//------------------------
	// xac
	var xacRow = new UIRow().setMarginLeft( '10px' );
	var xac = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	xacRow.add( new UIText( 'x = ' ).setWidth( '140px' ) );
	xacRow.add( xac );
	container.add( xacRow );
	xacRow.setDisplay( 'none' );

	// zac
	var zacRow = new UIRow().setMarginLeft( '10px' );
	var zac = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	zacRow.add( new UIText( 'z = ' ).setWidth( '140px' ) );
	zacRow.add( zac );
	container.add( zacRow );
	zacRow.setDisplay( 'none' );

	/*
	// Cmac
	var CmacRow = new UIRow().setMarginLeft( '10px' );
	var Cmac = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	CmacRow.add( new UIText( 'Cm(ac) = ' ).setWidth( '140px' ) );
	CmacRow.add( Cmac );
	container.add( CmacRow );
    CmacRow.setDisplay( 'none' );
    */
	//------------------------
	// Display for stallairspeed
	//------------------------

	// airspeed
	var sairspeedRow = new UIRow().setMarginLeft( '10px' );
	var sairspeed_units = new UIText( '' ).setWidth( '25 px' );
	var sairspeed = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	sairspeedRow.add( new UIText( 'Stall Airspeed = ' ).setWidth( '140px' ) );
	sairspeedRow.add( sairspeed );
	sairspeedRow.add( sairspeed_units );
	container.add( sairspeedRow );
	sairspeedRow.setDisplay( 'none' );

	//------------------------
	// Display for stallonset
	//------------------------
	var salphaRow = new UIRow().setMarginLeft( '10px' );
	var salpha_units = new UIText( 'deg' ).setWidth( '25 px' );
	var salpha = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	salphaRow.add( new UIText( 'Angle of Attack = ' ).setWidth( '140px' ) );
	salphaRow.add( salpha );
	salphaRow.add( salpha_units );
	container.add( salphaRow );
	salphaRow.setDisplay( 'none' );

	// Lift at onset
	var sLRow = new UIRow().setMarginLeft( '10px' );
	var sL_units = new UIText( '' ).setWidth( '25 px' );
	var sL = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	sLRow.add( new UIText( 'Lift = ' ).setWidth( '140px' ) );
	sLRow.add( sL );
	sLRow.add( sL_units );
	container.add( sLRow );
	sLRow.setDisplay( 'none' );

	// Wing
	var sWingRow = new UIRow().setMarginLeft( '10px' );
	var sWing = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	sWingRow.add( new UIText( 'Stalled Wing = ' ).setWidth( '140px' ) );
	sWingRow.add( sWing );
	container.add( sWingRow );
	sWingRow.setDisplay( 'none' );

	// location
	var sLocRow = new UIRow().setMarginLeft( '10px' );
	var sLoc = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	sLocRow.add( new UIText( 'Span Location (%) = ' ).setWidth( '140px' ) );
	sLocRow.add( sLoc );
	container.add( sLocRow );
	sLocRow.setDisplay( 'none' );


	//------------------------
	// Display for pitchtrim
	//------------------------
	// alpha
	var talphaRow = new UIRow().setMarginLeft( '10px' );
	var talpha = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	talphaRow.add( new UIText( 'alpha (deg) = ' ).setWidth( '140px' ) );
	talphaRow.add( talpha );
	container.add( talphaRow );
	talphaRow.setDisplay( 'none' );

	// elevator
	var tdeRow = new UIRow().setMarginLeft( '10px' );
	var tde = new UIText().setWidth( '75px' ).setColor( '#888' ).setFontSize( '12px' );
	tdeRow.add( new UIText( 'elevator (deg) = ' ).setWidth( '140px' ) );
	tdeRow.add( tde );
	container.add( tdeRow );
	tdeRow.setDisplay( 'none' );

	function update() {

		calculate_reference_values( editor );

		area.setValue( analysis.reference.area.toFixed( 4 ) );
		long_len.setValue( analysis.reference.longitudinal_length.toFixed( 4 ) );
		lat_len.setValue( analysis.reference.lateral_length.toFixed( 4 ) );
		//set units
		if ( analysis.condition.units == 'English' ) {

			area_units.setValue( 'ft^2' );
			long_len_units.setValue( 'ft' );
			lat_len_units.setValue( 'ft' );
			WL_units.setValue( 'lbs' );
			WD_units.setValue( 'lbs' );
			PT_units.setValue( 'lbs' );
			Pl_units.setValue( 'lb-ft' );
			FL_units.setValue( 'lbs' );
			FD_units.setValue( 'lbs' );
			FS_units.setValue( 'lbs' );
			MX_units.setValue( 'lb-ft' );
			MY_units.setValue( 'lb-ft' );
			MZ_units.setValue( 'lb-ft' );
			sairspeed_units.setValue( 'ft/s' );
			sL_units.setValue( 'lbs' );

		} else {

			area_units.setValue( 'm^2' );
			long_len_units.setValue( 'm' );
			lat_len_units.setValue( 'm' );
			WL_units.setValue( 'N' );
			WD_units.setValue( 'N' );
			PT_units.setValue( 'N' );
			Pl_units.setValue( 'N-m' );
			FL_units.setValue( 'N' );
			FD_units.setValue( 'N' );
			FS_units.setValue( 'N' );
			MX_units.setValue( 'N-m' );
			MY_units.setValue( 'N-m' );
			MZ_units.setValue( 'N-m' );
			sairspeed_units.setValue( 'm/s' );
			sL_units.setValue( 'N' );

		}


		var type = runType.getValue();
		switch ( type ) {

			case 'forces':
				analysis.run = { 'forces': "" };
				break;
			case 'derivatives':
				analysis.run = { 'derivatives': "" };
				break;
			case 'aerocenter':
				analysis.run = { 'aerocenter': "" };
				break;
			case 'stallonset':
				analysis.run = { 'stallonset': "" };
				break;
			case 'stallairspeed':
				analysis.run = {};
				analysis.run.stallairspeed = {};
				analysis.run.stallairspeed.weight = weight.getValue();
				break;
			case 'pitchtrim':
				analysis.run = {};
				analysis.run.pitchtrim = {};
				analysis.run.pitchtrim.target_L = Ltrim.getValue();
				analysis.run.pitchtrim.target_m = mtrim.getValue();
				break;
			case 'targetl':
				analysis.run = {};
				analysis.run.targetl = {};
				analysis.run.targetl.target_L = Ltrim.getValue();
				break;
			case 'distributions':
				analysis.run = { 'distributions': { "output": "json" } };
				break;

		}

		wingRow.setDisplay( type === 'forces' ? '' : 'none' );
		propRow.setDisplay( type === 'forces' ? '' : 'none' );
		totalRow.setDisplay( type === 'forces' ? '' : 'none' );

		CLaRow.setDisplay( type === 'derivatives' ? '' : 'none' );
		CDaRow.setDisplay( type === 'derivatives' ? '' : 'none' );
		CmaRow.setDisplay( type === 'derivatives' ? '' : 'none' );
		CSbRow.setDisplay( type === 'derivatives' ? '' : 'none' );
		ClbRow.setDisplay( type === 'derivatives' ? '' : 'none' );
		CnbRow.setDisplay( type === 'derivatives' ? '' : 'none' );
		smRow.setDisplay( type === 'derivatives' ? '' : 'none' );
		derivNote.setDisplay( type === 'derivatives' ? '' : 'none' );

		xacRow.setDisplay( type === 'aerocenter' ? '' : 'none' );
		zacRow.setDisplay( type === 'aerocenter' ? '' : 'none' );
		//CmacRow.setDisplay( type === 'aerocenter' ? '' : 'none' );

		sairspeedRow.setDisplay( type === 'stallairspeed' ? '' : 'none' );
		salphaRow.setDisplay( ( ( type === 'stallonset' ) || ( type === 'stallairspeed' ) ) ? '' : 'none' );
		sLRow.setDisplay( ( ( type === 'stallonset' ) || ( type === 'stallairspeed' ) ) ? '' : 'none' );
		sWingRow.setDisplay( ( ( type === 'stallonset' ) || ( type === 'stallairspeed' ) ) ? '' : 'none' );
		sLocRow.setDisplay( ( ( type === 'stallonset' ) || ( type === 'stallairspeed' ) ) ? '' : 'none' );

		LtrimRow.setDisplay( ( ( type === 'pitchtrim' ) || ( type === 'targetl' ) ) ? '' : 'none' );
		mtrimRow.setDisplay( type === 'pitchtrim' ? '' : 'none' );
		talphaRow.setDisplay( ( ( type === 'pitchtrim' ) || ( type === 'targetl' ) ) ? '' : 'none' );
		tdeRow.setDisplay( type === 'pitchtrim' ? '' : 'none' );
		weightRow.setDisplay( type === 'stallairspeed' ? '' : 'none' );

		analysis.solver.type = 'linear'; //solverType.getValue();

	}


	function saveResults() {

		doSave = 1;
		updateResults();

	}

	function updateResults() {

		update();
		runAnalysis( editor, run_callback );

	}


	function run_callback( result ) {

		var datafile = false; //=1 if the incoming json file should be parsed differently as bulk data

		if ( result.error == undefined ) {

			var type = runType.getValue();
			switch ( type ) {

				case 'forces':
					var zero = 0;
					if ( 'total' in result.wing_results ) {

						WL.setValue( result.wing_results.total.FL.toFixed( 4 ) );
						WD.setValue( result.wing_results.total.FD.toFixed( 4 ) );
						WLD.setValue( ( result.wing_results.total.FL / result.wing_results.total.FD ).toFixed( 4 ) );

					} else {

						WL.setValue( zero.toFixed( 4 ) );
						WD.setValue( zero.toFixed( 4 ) );
						WLD.setValue( zero.toFixed( 4 ) );

					}

					if ( 'total' in result.prop_results ) {

						PT.setValue( result.prop_results.total.Thrust.toFixed( 4 ) );
						Pl.setValue( result.prop_results.total.Torque.toFixed( 4 ) );

					} else {

						PT.setValue( zero.toFixed( 4 ) );
						Pl.setValue( zero.toFixed( 4 ) );

					}

					FL.setValue( result.total_results.FL.toFixed( 4 ) );
					FD.setValue( result.total_results.FD.toFixed( 4 ) );
					FS.setValue( result.total_results.FS.toFixed( 4 ) );
					MX.setValue( result.total_results.MX.toFixed( 4 ) );
					MY.setValue( result.total_results.MY.toFixed( 4 ) );
					MZ.setValue( result.total_results.MZ.toFixed( 4 ) );
					break;
				case 'derivatives':
					CLa.setValue( result.stability_derivatives.CL_a.toFixed( 4 ) );
					CDa.setValue( result.stability_derivatives.CD_a.toFixed( 4 ) );
					Cma.setValue( result.stability_derivatives.Cm_a.toFixed( 4 ) );
					CSb.setValue( result.stability_derivatives.CS_b.toFixed( 4 ) );
					Clb.setValue( result.stability_derivatives.Cl_b.toFixed( 4 ) );
					Cnb.setValue( result.stability_derivatives.Cn_b.toFixed( 4 ) );
					sm.setValue( result.stability_derivatives.static_margin.toFixed( 4 ) );
					break;
				case 'aerocenter':
					xac.setValue( result.x_ac.toFixed( 4 ) );
					zac.setValue( result.z_ac.toFixed( 4 ) );
					//Cmac.setValue( result.Cm_ac.toFixed(4) );
					editor.scene.children[ 1 ].position.x = result.x_ac;
					editor.scene.children[ 1 ].position.z = result.z_ac;
					editor.scene.children[ 1 ].visible = true;
					editor.scene.children[ 1 ].geometry.computeBoundingSphere();
					editor.scene.children[ 1 ].geometry.computeBoundingBox();

					editor.signals.objectChanged.dispatch( editor.scene.children[ 1 ] );
					break;
				case 'stallonset':
					salpha.setValue( result.alpha.toFixed( 2 ) );
					sL.setValue( result.lift.toFixed( 2 ) );
					sWing.setValue( result.stalled_wing );
					sLoc.setValue( ( 100.0 * result.span_location ).toFixed( 1 ) );
					if ( result.alpha == - 1.0 ) alert( 'Error: No airfoil CLmax specified. Check your airfoil settings.' );
					break;
				case 'stallairspeed':
					sairspeed.setValue( result.airspeed.toFixed( 2 ) );
					salpha.setValue( result.alpha.toFixed( 2 ) );
					sL.setValue( result.lift.toFixed( 2 ) );
					sWing.setValue( result.stalled_wing );
					sLoc.setValue( ( 100.0 * result.span_location ).toFixed( 1 ) );
					if ( result.alpha == - 1.0 ) alert( 'Error: No airfoil CLmax specified. Check your airfoil settings.' );
					break;
				case 'pitchtrim':
					talpha.setValue( result.alpha.toFixed( 2 ) );
					tde.setValue( result.elevator.toFixed( 2 ) );
					analysis.condition.alpha = result.alpha;
					analysis.controls.elevator.deflection = result.elevator;
					// TODO: Fix this
					// alpha.setValue( result.alpha );
					// elevator.setValue( result.elevator );
					updateCondition();
					break;
				case 'targetl':
					talpha.setValue( result.alpha.toFixed( 2 ) );
					analysis.condition.alpha = result.alpha;
					// TODO: Fix this
					// alpha.setValue( result.alpha );
					updateCondition();
					break;
				case 'distributions':
					doSave = 1;
					datafile = true;
					break;

			}

			if ( doSave == 1 ) {

				if ( result !== undefined ) {

					var defaultFilename = editor.scene.name + '_' + type + '_' + Date();
					var filename = prompt( "Enter a filename to save the results:", defaultFilename );
					if ( filename != null ) {

						if ( datafile ) {

							let output = JSON.stringify( result.data, null, '\t' );
							output = output.replace( /newline/g, '\n' );
							output = output.replace( /"/g, "" );
							exportString( output, filename + ".txt" );

						} else {

							let output = JSON.stringify( result, null, '\t' );
							output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );
							exportString( output, filename + ".json" );

						}

					}

				}

			}

		} else {

			let msg = '';
			switch ( result.error ) {

				case 'unliftable':
					msg = 'Aw Snap. Your aircraft is having trouble producing enough lift. Try adding more wing area or increasing the velocity.';
					confirm( msg );
					break;
				case 'untrimmable':
					msg = 'Aw Snap. Your aircraft is having trouble being trimmed. Try increasing elevator size or changing target values.';
					confirm( msg );
					break;
				case 'unstallable':
					msg = 'Aw Snap. Your aircraft doesnt have wings to stall. Add wings.';
					confirm( msg );
					break;
				case 'underivable':
					msg = 'Aw Snap. Aircraft must have wings to run derivatives analysis. \nAdd wings or run different analysis';
					confirm( msg );
					break;
				case 'no_elevator':
					msg = 'Aw Snap. Your aircraft cannot be trimmed because it has no elevator. Please add an elevator.';
					confirm( msg );
					break;
				case 'upgrade':
					msg = 'Aw Snap. This feature requires an upgrade to MachUp Plus.\n\nClick "OK" to upgrade to MachUp Plus.';
					if ( confirm( msg ) ) {

						window.open( "https://www.blucraft.com/machup/purchase" );

					}

					break;
				case 'expire':
					msg = 'Aw Snap. Your subscription has expired.\n\nClick "OK to renew.';
					if ( confirm( msg ) ) {

						window.open( "https://www.blucraft.com/machup/purchase" );

					}

					break;
				default:
					msg = result.error;
					alert( msg );

			}

		}

		doSave = 0;

	}



	var exportString = function ( output, filename ) {

		var blob = new Blob( [ output ], { type: "text/plain;charset=utf-8" } );
		saveAs( blob, filename );
		//var blob = new Blob( [ output ], { type: 'text/plain' } );
		//var objectURL = URL.createObjectURL( blob );

		//window.open( objectURL, '_blank' );
		//window.focus();

	};

	update();

	return container;

}

export { SidebarAnalysis };
