import { UIRow, UIText, UIInteger, UINumber, UISelect, UIBreak, UIInput, UIHorizontalRule, UICheckbox } from './libs/ui.js';
import { wing_update_children, check_airfoil, THREEWingGeometry } from './MU.js';
import { UICollapsiblePanel } from "./libs/ui.extensions.js";

function SidebarGeometryWingGeometry( editor, object ) {

	var signals = editor.signals;

	var container = new UIRow();

	var parameters = object.geometry.parameters;

	// is_mainwing
	var mainwingRow = new UIRow();
	var is_main_wing = new UICheckbox( parameters.is_main ).setMarginLeft( '-40px' ).onChange( update );
	mainwingRow.add( new UIText( 'Main Wing' ).setWidth( '140px' ) );
	mainwingRow.add( is_main_wing );
	container.add( mainwingRow );

	// side
	var sideRow = new UIRow();
	var sideType = new UISelect().setOptions( {

		'both': 'Both',
		'right': 'Right',
		'left': 'Left'

	} ).setWidth( '100px' ).setColor( '#000' ).setFontSize( '12px' );
	sideType.onChange( update );
	sideRow.add( new UIText( 'Side' ).setWidth( '100px' ) );
	sideRow.add( sideType );
	container.add( sideRow );
	sideType.setValue( parameters.side );

	// y-offset
	var dyRow = new UIRow();
	var dy = new UINumber( parameters.dy ).onChange( update );
	dyRow.add( new UIText( 'y-Offset' ).setWidth( '100px' ) );
	dyRow.add( dy );
	container.add( dyRow );

	// span
	var spanRow = new UIRow();
	var span = new UINumber( parameters.span ).onChange( update );
	spanRow.add( new UIText( 'Semispan' ).setWidth( '100px' ) );
	spanRow.add( span );
	container.add( spanRow );

	// --------------------------------------
	container.add( new UIHorizontalRule() );

	// mount
	var mountRow = new UIRow();
	var mount = new UINumber( parameters.mount ).onChange( update );
	mountRow.add( new UIText( 'Mount Angle (deg)' ).setWidth( '100px' ) );
	mountRow.add( mount );
	container.add( mountRow );

	// washout
	var washoutRow = new UIRow();
	var washout = new UINumber( parameters.washout ).onChange( update );
	washoutRow.add( new UIText( 'Washout (deg)' ).setWidth( '100px' ) );
	washoutRow.add( washout );
	container.add( washoutRow );

	// sweep
	var sweepRow = new UIRow();
	var sweep = new UINumber( parameters.sweep ).setRange( - 80.0, 80.0 ).onChange( update );
	sweepRow.add( new UIText( 'Sweep (deg)' ).setWidth( '100px' ) );
	sweepRow.add( sweep );
	container.add( sweepRow );

	// dihedral
	var dihedralRow = new UIRow();
	var dihedral = new UINumber( parameters.dihedral ).onChange( update );
	dihedralRow.add( new UIText( 'Dihedral (deg)' ).setWidth( '100px' ) );
	dihedralRow.add( dihedral );
	container.add( dihedralRow );

	// --------------------------------------
	container.add( new UIHorizontalRule() );

	// root_chord
	var root_chordRow = new UIRow();
	var root_chord = new UINumber( parameters.root_chord ).onChange( update );
	root_chordRow.add( new UIText( 'Root Chord' ).setWidth( '100px' ) );
	root_chordRow.add( root_chord );
	container.add( root_chordRow );

	// tip_chord
	var tip_chordRow = new UIRow();
	var tip_chord = new UINumber( parameters.tip_chord ).onChange( update );
	tip_chordRow.add( new UIText( 'Tip Chord' ).setWidth( '100px' ) );
	tip_chordRow.add( tip_chord );
	container.add( tip_chordRow );


	// --------------------------------------
	// root_airfoil
	// --------------------------------------
	var rootAirfoil = new UICollapsiblePanel();
	rootAirfoil.setCollapsed( true );
	rootAirfoil.addStatic( new UIText( 'Root Airfoil' ) );
	rootAirfoil.add( new UIBreak() );

	var root_nameRow = new UIRow().setWidth( '300px' ); // DFH
	var root_nameType = new UIInput().setWidth( '100px' ).setColor( '#444' ).setFontSize( '12px' ).onChange( update );
	root_nameRow.add( new UIText( 'Airfoil (graphics only)' ).setWidth( '140px' ) );
	root_nameRow.add( root_nameType );
	rootAirfoil.add( root_nameRow );
	for ( var root_name in parameters.root_airfoil ) break;
	root_nameType.setValue( root_name );

	// root al0
	var root_al0Row = new UIRow().setWidth( '300px' );
	var root_al0 = new UINumber( parameters.root_airfoil[ root_name ].properties.alpha_L0 ).onChange( update );
	root_al0Row.add( new UIText( 'Zero-Lift Alpha (rad)' ).setWidth( '140px' ) );
	root_al0Row.add( root_al0 );
	rootAirfoil.add( root_al0Row );

	// root cla
	var root_ClaRow = new UIRow().setWidth( '300px' ); // DFH
	var root_Cla = new UINumber( parameters.root_airfoil[ root_name ].properties.CL_alpha ).onChange( update );
	root_ClaRow.add( new UIText( 'Lift Slope (1/rad)' ).setWidth( '140px' ) );
	root_ClaRow.add( root_Cla );
	rootAirfoil.add( root_ClaRow );

	// root Cml0
	var root_Cml0Row = new UIRow().setWidth( '300px' ); // DFH
	var root_Cml0 = new UINumber( parameters.root_airfoil[ root_name ].properties.Cm_L0 ).onChange( update );
	root_Cml0Row.add( new UIText( 'Zero-Lift Cm' ).setWidth( '140px' ) );
	root_Cml0Row.add( root_Cml0 );
	rootAirfoil.add( root_Cml0Row );

	// root Cma
	var root_CmaRow = new UIRow().setWidth( '300px' ); // DFH
	var root_Cma = new UINumber( parameters.root_airfoil[ root_name ].properties.Cm_alpha ).onChange( update );
	root_CmaRow.add( new UIText( 'Moment Slope (1/rad)' ).setWidth( '140px' ) );
	root_CmaRow.add( root_Cma );
	rootAirfoil.add( root_CmaRow );

	// root CD0
	var root_CD0Row = new UIRow().setWidth( '300px' ); // DFH
	var root_CD0 = new UINumber( parameters.root_airfoil[ root_name ].properties.CD0 ).onChange( update );
	root_CD0Row.add( new UIText( 'Zero-Lift CD' ).setWidth( '140px' ) );
	root_CD0Row.add( root_CD0 );
	rootAirfoil.add( root_CD0Row );

	// root CD0_L
	var root_CD0_LRow = new UIRow().setWidth( '300px' ); // DFH
	var root_CD0_L = new UINumber( parameters.root_airfoil[ root_name ].properties.CD0_L ).onChange( update );
	root_CD0_LRow.add( new UIText( 'CD,L' ).setWidth( '140px' ) );
	root_CD0_LRow.add( root_CD0_L );
	rootAirfoil.add( root_CD0_LRow );

	// root CD0_L2
	var root_CD0_L2Row = new UIRow().setWidth( '300px' ); // DFH
	var root_CD0_L2 = new UINumber( parameters.root_airfoil[ root_name ].properties.CD0_L2 ).onChange( update );
	root_CD0_L2Row.add( new UIText( 'CD,L^2' ).setWidth( '140px' ) );
	root_CD0_L2Row.add( root_CD0_L2 );
	rootAirfoil.add( root_CD0_L2Row );

	// root CLmax
	var root_CLmaxRow = new UIRow().setWidth( '300px' ); // DFH
	var root_CLmax = new UINumber( parameters.root_airfoil[ root_name ].properties.CL_max ).onChange( update );
	root_CLmaxRow.add( new UIText( 'Max Lift Coefficient' ).setWidth( '140px' ) );
	root_CLmaxRow.add( root_CLmax );
	rootAirfoil.add( root_CLmaxRow );

	container.add( rootAirfoil );

	// --------------------------------------
	// tip_airfoil
	// --------------------------------------
	var tipAirfoil = new UICollapsiblePanel();
	tipAirfoil.setCollapsed( true );
	tipAirfoil.addStatic( new UIText( 'Tip Airfoil' ) );
	rootAirfoil.add( new UIBreak() );

	var same_as_rootRow = new UIRow().setWidth( '300px' ).setMarginTop( '10px' );
	var sameAsRoot = new UICheckbox( parameters.same_as_root ).onChange( update ); // DFH
	same_as_rootRow.add( new UIText( 'Same as Root' ).setWidth( '140px' ) );
	same_as_rootRow.add( sameAsRoot );
	tipAirfoil.add( same_as_rootRow ); // DFH

	var tip_nameRow = new UIRow().setWidth( '300px' ); // DFH
	var tip_nameType = new UIInput().setWidth( '100px' ).setColor( '#444' ).setFontSize( '12px' ).onChange( update );
	tip_nameRow.add( new UIText( 'Airfoil (graphics only)' ).setWidth( '140px' ) );
	tip_nameRow.add( tip_nameType );
	tipAirfoil.add( tip_nameRow );
	for ( var tip_name in parameters.tip_airfoil ) break;
	tip_nameType.setValue( tip_name );

	// tip al0
	var tip_al0Row = new UIRow().setWidth( '300px' ); // DFH
	var tip_al0 = new UINumber( parameters.tip_airfoil[ tip_name ].properties.alpha_L0 ).onChange( update );
	tip_al0Row.add( new UIText( 'Zero-Lift Alpha (rad)' ).setWidth( '140px' ) );
	tip_al0Row.add( tip_al0 );
	tipAirfoil.add( tip_al0Row );

	// tip cla
	var tip_ClaRow = new UIRow().setWidth( '300px' ); // DFH
	var tip_Cla = new UINumber( parameters.tip_airfoil[ tip_name ].properties.CL_alpha ).onChange( update );
	tip_ClaRow.add( new UIText( 'Lift Slope (1/rad)' ).setWidth( '140px' ) );
	tip_ClaRow.add( tip_Cla );
	tipAirfoil.add( tip_ClaRow );

	// tip Cml0
	var tip_Cml0Row = new UIRow().setWidth( '300px' ); // DFH
	var tip_Cml0 = new UINumber( parameters.tip_airfoil[ tip_name ].properties.Cm_L0 ).onChange( update );
	tip_Cml0Row.add( new UIText( 'Zero-Lift Cm' ).setWidth( '140px' ) );
	tip_Cml0Row.add( tip_Cml0 );
	tipAirfoil.add( tip_Cml0Row );

	// tip Cma
	var tip_CmaRow = new UIRow().setWidth( '300px' ); // DFH
	var tip_Cma = new UINumber( parameters.tip_airfoil[ tip_name ].properties.Cm_alpha ).onChange( update );
	tip_CmaRow.add( new UIText( 'Moment Slope (1/rad)' ).setWidth( '140px' ) );
	tip_CmaRow.add( tip_Cma );
	tipAirfoil.add( tip_CmaRow );

	// tip CD0
	var tip_CD0Row = new UIRow().setWidth( '300px' ); // DFH
	var tip_CD0 = new UINumber( parameters.tip_airfoil[ tip_name ].properties.CD0 ).onChange( update );
	tip_CD0Row.add( new UIText( 'Zero-Lift CD' ).setWidth( '140px' ) );
	tip_CD0Row.add( tip_CD0 );
	tipAirfoil.add( tip_CD0Row );

	// tip CD0_L
	var tip_CD0_LRow = new UIRow().setWidth( '300px' ); // DFH
	var tip_CD0_L = new UINumber( parameters.tip_airfoil[ tip_name ].properties.CD0_L ).onChange( update );
	tip_CD0_LRow.add( new UIText( 'CD,L' ).setWidth( '140px' ) );
	tip_CD0_LRow.add( tip_CD0_L );
	tipAirfoil.add( tip_CD0_LRow );

	// tip CD0_L2
	var tip_CD0_L2Row = new UIRow().setWidth( '300px' ); // DFH
	var tip_CD0_L2 = new UINumber( parameters.tip_airfoil[ tip_name ].properties.CD0_L2 ).onChange( update );
	tip_CD0_L2Row.add( new UIText( 'CD,L^2' ).setWidth( '140px' ) );
	tip_CD0_L2Row.add( tip_CD0_L2 );
	tipAirfoil.add( tip_CD0_L2Row );

	// tip CLmax
	var tip_CLmaxRow = new UIRow().setWidth( '300px' ); // DFH
	var tip_CLmax = new UINumber( parameters.tip_airfoil[ tip_name ].properties.CL_max ).onChange( update );
	tip_CLmaxRow.add( new UIText( 'Max Lift Coefficient' ).setWidth( '140px' ) );
	tip_CLmaxRow.add( tip_CLmax );
	tipAirfoil.add( tip_CLmaxRow );

	tipAirfoil.setMarginBottom( '-8px' );
	container.add( tipAirfoil );

	// --------------------------------------
	container.add( new UIHorizontalRule() );


	// ribNum
	var ribNumRow = new UIRow().setWidth( '300px' );
	var ribNum = new UIInteger( parameters.ribNum ).setRange( 1, 200 ).onChange( update );
	ribNumRow.add( new UIText( 'Ribs (#)' ).setWidth( '140px' ) );
	ribNumRow.add( ribNum );
	container.add( ribNumRow );



	// nAirfoilPoints
	var afSegRow = new UIRow().setWidth( '300px' ); // DFH
	var nAFseg = new UISelect().setOptions( { "50": "50", "100": "100", "200": "200" } ).setWidth( '80px' ).setColor( '#444' ).setFontSize( '12px' );
	nAFseg.onChange( update );
	afSegRow.add( new UIText( 'Airfoil Segments' ).setWidth( '140px' ) );
	afSegRow.add( nAFseg );
	container.add( afSegRow );
	nAFseg.setValue( parameters.nAFseg );

	// --------------------------------------
	// Control Surface
	// --------------------------------------
	var controlSurface = new UICollapsiblePanel();
	controlSurface.setCollapsed( true );
	controlSurface.addStatic( new UIText( 'Control Surface' ) );
	controlSurface.add( new UIBreak() );

	// has_control_surface
	var hasCSRow = new UIRow();
	var has_control_surface = new UICheckbox( parameters.control.has_control_surface ).onChange( updateCS );
	hasCSRow.add( new UIText( 'Has control surface' ).setWidth( '140px' ) );
	hasCSRow.add( has_control_surface );
	controlSurface.add( hasCSRow );

	// CS Root Span Rib
	var cs_spanRootRow = new UIRow().setWidth( '300px' ); // DFH
	var cs_spanRootRib = new UIInteger( parameters.control.span_root_rib ).onChange( update );
	cs_spanRootRow.add( new UIText( 'Root Span Rib (#)' ).setWidth( '140px' ) );
	cs_spanRootRow.add( cs_spanRootRib );
	controlSurface.add( cs_spanRootRow );
	cs_spanRootRow.setDisplay( 'none' );

	// CS Tip Span Rib
	var cs_spanTipRow = new UIRow().setWidth( '300px' ); // DFH
	var cs_spanTipRib = new UIInteger( parameters.control.span_tip_rib ).onChange( update );
	cs_spanTipRow.add( new UIText( 'Tip Span Rib(#)' ).setWidth( '140px' ) );
	cs_spanTipRow.add( cs_spanTipRib );
	controlSurface.add( cs_spanTipRow );
	cs_spanTipRow.setDisplay( 'none' );

	// Chord %
	var cs_chordRow = new UIRow().setWidth( '300px' ); // DFH
	var cs_chord = new UINumber( parameters.control.chord_root ).onChange( update );
	cs_chordRow.add( new UIText( 'Chord %' ).setWidth( '140px' ) );
	cs_chordRow.add( cs_chord );
	controlSurface.add( cs_chordRow );
	cs_chordRow.setDisplay( 'none' );


	// Mix Elevator
	var elevatorRow = new UIRow().setWidth( '300px' ); // DFH
	var mixElevator = new UINumber( parameters.control.mix.elevator ).onChange( update );
	elevatorRow.add( new UIText( 'Elevator Mix' ).setWidth( '140px' ) );
	elevatorRow.add( mixElevator );
	controlSurface.add( elevatorRow );
	elevatorRow.setDisplay( 'none' );

	// Mix Rudder
	var rudderRow = new UIRow().setWidth( '300px' ); // DFH
	var mixRudder = new UINumber( - parameters.control.mix.rudder ).onChange( update );
	rudderRow.add( new UIText( 'Rudder Mix' ).setWidth( '140px' ) );
	rudderRow.add( mixRudder );
	controlSurface.add( rudderRow );
	rudderRow.setDisplay( 'none' );

	// Mix Aileron
	var aileronRow = new UIRow().setWidth( '300px' ); // DFH
	var mixAileron = new UINumber( parameters.control.mix.aileron ).onChange( update );
	aileronRow.add( new UIText( 'Aileron Mix' ).setWidth( '140px' ) );
	aileronRow.add( mixAileron );
	controlSurface.add( aileronRow );
	aileronRow.setDisplay( 'none' );

	// Mix Flap
	var flapRow = new UIRow().setWidth( '300px' ); // DFH
	var mixFlap = new UINumber( parameters.control.mix.flap ).onChange( update );
	flapRow.add( new UIText( 'Flap Mix' ).setWidth( '140px' ) );
	flapRow.add( mixFlap );
	controlSurface.add( flapRow );
	flapRow.setDisplay( 'none' );

	container.add( controlSurface );

	//

	function updateCS() {

		const displayType = has_control_surface.getValue() ? '' : 'none';

		cs_spanRootRow.setDisplay( displayType );
		cs_spanTipRow.setDisplay( displayType );

		cs_chordRow.setDisplay( displayType );

		elevatorRow.setDisplay( displayType );
		rudderRow.setDisplay( displayType );
		aileronRow.setDisplay( displayType );
		flapRow.setDisplay( displayType );

		update();

	}

	const tipDisplay = ( isDisplayed = true ) => {

		const displayType = isDisplayed ? 'block' : 'none';
		tip_nameRow.setDisplay( displayType );
		tip_al0Row.setDisplay( displayType );
		tip_ClaRow.setDisplay( displayType );
		tip_Cml0Row.setDisplay( displayType );
		tip_CmaRow.setDisplay( displayType );
		tip_CD0Row.setDisplay( displayType );
		tip_CD0_LRow.setDisplay( displayType );
		tip_CD0_L2Row.setDisplay( displayType );
		tip_CLmaxRow.setDisplay( displayType );

	};

	function update() {

		object.geometry.dispose();

		const left_start = new THREE.Vector3( 0.0, 0.0, 0.0 );
		const right_start = new THREE.Vector3( 0.0, 0.0, 0.0 );


		cs_spanRootRib.setRange( 0, ribNum.getValue() );
		cs_spanTipRib.setRange( 0, ribNum.getValue() );


		if ( object.parent.type == "Mesh" && object.parent.geometry.type == "WingGeometry" ) {

			left_start = object.parent.geometry.leftTip.clone();
			right_start = object.parent.geometry.rightTip.clone();

		}

		const tipChecked = sameAsRoot.dom.checked;
		var root_airfoil = {};
	        var afname = check_airfoil( root_nameType.getValue() );
	        root_airfoil[ afname ] = {
			properties: {
				type: 'linear',
				alpha_L0: root_al0.getValue(),
				CL_alpha: root_Cla.getValue(),
				Cm_L0: root_Cml0.getValue(),
				Cm_alpha: root_Cma.getValue(),
				CD0: root_CD0.getValue(),
				CD0_L: root_CD0_L.getValue(),
				CD0_L2: root_CD0_L2.getValue(),
				CL_max: root_CLmax.getValue(),
			}
		};

		if ( tipChecked ) {

			var tip_airfoil = root_airfoil;
			var tip_afname = root_nameType.getValue();
			tip_airfoil[ tip_afname ] = root_airfoil[ afname ];
			tipDisplay( false );

		} else {

			var tip_airfoil = {};
			var afname = check_airfoil( tip_nameType.getValue() );
			tip_airfoil[ afname ] = {
				properties: {
					type: 'linear',
					alpha_L0: tip_al0.getValue(),
					CL_alpha: tip_Cla.getValue(),
					Cm_L0: tip_Cml0.getValue(),
					Cm_alpha: tip_Cma.getValue(),
					CD0: tip_CD0.getValue(),
					CD0_L: tip_CD0_L.getValue(),
					CD0_L2: tip_CD0_L2.getValue(),
					CL_max: tip_CLmax.getValue(),
				}
			};

		}

		tipDisplay( ! tipChecked );

		object.geometry = new THREEWingGeometry(
			{
				is_main: is_main_wing.getValue(),
				side: sideType.getValue(),
				span: span.getValue(),
				sweep: sweep.getValue(),
				dihedral: dihedral.getValue(),
				mount: mount.getValue(),
				washout: washout.getValue(),
				root_chord: root_chord.getValue(),
				tip_chord: tip_chord.getValue(),
				root_airfoil,
				tip_airfoil,
				nSeg: ribNum.getValue() * 2,
				nAFseg: parseInt( nAFseg.getValue() ),
				left_start,
				right_start,
				ribNum: ribNum.getValue(),
				dy: dy.getValue(),
				control: {
					has_control_surface: has_control_surface.getValue(),
					span_root_rib: cs_spanRootRib.getValue(),
					span_tip_rib: cs_spanTipRib.getValue(),
					chord_root: cs_chord.getValue(),
					chord_tip: cs_chord.getValue(),
					is_sealed: 1,
					mix: {
						elevator: mixElevator.getValue(),
						rudder: - mixRudder.getValue(),
						aileron: mixAileron.getValue(),
						flap: mixFlap.getValue(),

					},
				},
				sameAsRoot: sameAsRoot.getValue() // DFH
			}

		);


		object.geometry.computeBoundingSphere();
		object.geometry.computeBoundingBox();
		signals.objectChanged.dispatch( object );
		wing_update_children( signals, object );
		signals.objectChanged.dispatch( object ); // reset as selected object in GUI
		//Turn off Aero Center
		if ( editor.scene.children[ 1 ] ) {

			editor.scene.children[ 1 ].visible = false;
			signals.objectChanged.dispatch( editor.scene.children[ 1 ] );

		}

	}

	updateCS();
	return container;

}

export { SidebarGeometryWingGeometry };
