import { UIPanel, UINumber, UIBreak, UISelect, UIInteger, UIText, UICheckbox, UIRow, UIHorizontalRule } from './libs/ui.js';
import { setDoSave } from "./Sidebar.Analysis.js";
import { updateCondition, analysis } from "./MU.js";

//condition variables had to be pulled out of Sidebar.Condition so that they would be accessible from Analysis Tab
let editor = undefined;

const updateConditionHandler = () => {

	updateCondition( editor, { unitType, flap, propRotRow, throttleRow, propRot, indivControl, throttle, velocityText, densityText, velocity, density, alpha, beta, elevator, rudder, aileron } );

};


var unitType = new UISelect().setOptions( {
	'English': 'English',
	'SI': 'SI'
} ).setWidth( '100px' ).setColor( '#000' ).setFontSize( '12px' );
unitType.onChange( updateConditionHandler );


var velocityText = new UIText( 'Velocity (ft/s)' ).setWidth( '140px' );
var velocity = new UINumber( analysis.condition.velocity ).onChange( updateConditionHandler );

var densityText = new UIText( 'Density (slugs/ft^3)' ).setWidth( '140px' );
var density = new UINumber( analysis.condition.density ).onChange( updateConditionHandler );

var alpha = new UINumber( analysis.condition.alpha ).onChange( updateConditionHandler );
var beta = new UINumber( analysis.condition.beta ).onChange( updateConditionHandler );

var elevator = new UINumber( analysis.controls.elevator.deflection ).onChange( updateConditionHandler );
var rudder = new UINumber( analysis.controls.rudder.deflection ).onChange( updateConditionHandler );
var aileron = new UINumber( analysis.controls.aileron.deflection ).onChange( updateConditionHandler );
var flap = new UINumber( analysis.controls.flap.deflection ).onChange( updateConditionHandler );

var propRot = new UIInteger( analysis.prop_controls.rot_per_sec * 60 ).setRange( 0, Infinity ).onChange( updateConditionHandler );
var propRotRow = new UIRow().setMarginLeft( '10px' );
var throttleRow = new UIRow().setMarginLeft( '10px' );
var throttle = new UIInteger( analysis.prop_controls.electric_throttle * 100 ).setRange( 0, 100 ).onChange( updateConditionHandler );
var indivControl = new UICheckbox( analysis.prop_controls.individual_control ).onChange( updateConditionHandler );





function SidebarCondition( _editor ) {

	editor = _editor;
	var inputs = {};
	inputs.Ltrim = 0.0;
	inputs.mtrim = 0.0;
	inputs.weight = 10.0;

	setDoSave( 0 );

	var container = new UIPanel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );

	// --------------------------------------
	// Condition
	// --------------------------------------
	var condition = new UIRow();

	condition.add( new UIHorizontalRule() );

	//Units
	var unitRow = new UIRow();
	unitRow.add( new UIText( 'Units' ).setWidth( '140px' ) );
	unitRow.add( unitType );
	container.add( unitRow );
	unitType.setValue( analysis.condition.units );

	// velocity
	var velocityRow = new UIRow().setMarginLeft( '10px' );
	velocityRow.add( velocityText );
	velocityRow.add( velocity );
	condition.add( velocityRow );

	// density
	var densityRow = new UIRow().setMarginLeft( '10px' );
	densityRow.add( densityText );
	densityRow.add( density );
	condition.add( densityRow );

	// alpha
	var alphaRow = new UIRow().setMarginLeft( '10px' );
	alphaRow.add( new UIText( 'Angle of Attack (deg)' ).setWidth( '140px' ) );
	alphaRow.add( alpha );
	condition.add( alphaRow );

	// beta
	var betaRow = new UIRow().setMarginLeft( '10px' );
	betaRow.add( new UIText( 'Sideslip (deg)' ).setWidth( '140px' ) );
	betaRow.add( beta );
	condition.add( betaRow );

	// --------------------------------------
	condition.add( new UIHorizontalRule() );
	container.add( condition );
	// --------------------------------------
	// Control Surfaces
	// --------------------------------------
	var control = new UIRow();
	control.add( new UIText( 'Control Surfaces' ) );
	control.add( new UIBreak() );
	// --------------------------------------
	control.add( new UIHorizontalRule() );

	// elevator
	var elevatorRow = new UIRow().setMarginLeft( '10px' );
	elevatorRow.add( new UIText( 'Elevator (deg)' ).setWidth( '140px' ) );
	elevatorRow.add( elevator );
	control.add( elevatorRow );

	// rudder
	var rudderRow = new UIRow().setMarginLeft( '10px' );
	rudderRow.add( new UIText( 'Rudder (deg)' ).setWidth( '140px' ) );
	rudderRow.add( rudder );
	control.add( rudderRow );

	// aileron
	var aileronRow = new UIRow().setMarginLeft( '10px' );
	aileronRow.add( new UIText( 'Aileron (deg)' ).setWidth( '140px' ) );
	aileronRow.add( aileron );
	control.add( aileronRow );

	// flap
	var flapRow = new UIRow().setMarginLeft( '10px' );
	flapRow.add( new UIText( 'Flap (deg)' ).setWidth( '140px' ) );
	flapRow.add( flap );
	control.add( flapRow );

	//------------------------------------------
	control.add( new UIHorizontalRule() );

	container.add( control );


	// --------------------------------------
	// Propeller Controls
	// --------------------------------------
	var propControl = new UIRow();
	propControl.add( new UIText( 'Propeller' ) );
	propControl.add( new UIBreak() );
	// --------------------------------------
	propControl.add( new UIHorizontalRule() );

	//propeller condition

	propRotRow.add( new UIText( 'Rotation Rate (rpm)' ).setWidth( '140px' ) );
	propRotRow.add( propRot );
	propControl.add( propRotRow );
	propRotRow.setDisplay( 'none' );


	throttleRow.add( new UIText( 'Throttle (%)' ).setWidth( '140px' ) );
	throttleRow.add( throttle );
	propControl.add( throttleRow );
	throttleRow.setDisplay( 'none' );

	var indivControlRow = new UIRow().setMarginLeft( '10px' );
	indivControlRow.add( new UIText( 'Individual Control' ).setWidth( '140px' ) );
	indivControlRow.add( indivControl );
	propControl.add( indivControlRow );
	indivControlRow.setDisplay( 'none' );

	container.add( propControl );

	// --------------------------------------
	container.add( new UIHorizontalRule() );

	updateConditionHandler();
	return container;

}


export { SidebarCondition, updateCondition };
