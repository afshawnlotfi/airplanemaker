import * as THREE from '../../build/three.module.js';

import { try_set_parent, wing_update_children, update_prop_controls } from './MU.js';
import { SetValueCommand } from './commands/SetValueCommand.js';
import { SetPositionCommand } from './commands/SetPositionCommand.js';
import { SetRotationCommand } from './commands/SetRotationCommand.js';
import { SetScaleCommand } from './commands/SetScaleCommand.js';
import { UIPanel, UIRow, UIInput, UIButton, UIColor, UICheckbox, UITextArea, UIText, UINumber, UISelect } from './libs/ui.js';

function SidebarObject3D( editor ) {

	THREE.Object3D.DefaultUp.set( 0, 0, - 1 ); // DFH

	var signals = editor.signals;

	var container = new UIPanel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );
	container.setDisplay( 'none' );

	// Actions

	var objectActions = new UISelect().setPosition( 'absolute' ).setRight( '8px' ).setFontSize( '11px' );
	objectActions.setOptions( {

		'Actions': 'Actions',
		'Reset Position': 'Reset Position',
		'Reset Rotation': 'Reset Rotation',
		'Reset Scale': 'Reset Scale'

	} );
	objectActions.onClick( function ( event ) {

		event.stopPropagation(); // Avoid panel collapsing

	} );
	objectActions.onChange( function ( ) {

		var object = editor.selected;

		switch ( this.getValue() ) {

			case 'Reset Position':
				editor.execute( new SetPositionCommand( object, new THREE.Vector3( 0, 0, 0 ) ) );
				break;

			case 'Reset Rotation':
				editor.execute( new SetRotationCommand( object, new THREE.Euler( 0, 0, 0 ) ) );
				break;

			case 'Reset Scale':
				editor.execute( new SetScaleCommand( object, new THREE.Vector3( 1, 1, 1 ) ) );
				break;

		}

		this.setValue( 'Actions' );

	} );
	//container.add( objectActions );

	// type

	var objectTypeRow = new UIRow();
	var objectType = new UIText();

	objectTypeRow.add( new UIText( 'Type' ).setWidth( '90px' ) );
	objectTypeRow.add( objectType );

	//container.add( objectTypeRow );

	// uuid

	var objectUUIDRow = new UIRow();
	var objectUUID = new UIInput().setWidth( '115px' ).setColor( '#444' ).setFontSize( '12px' ).setDisabled( true );
	var objectUUIDRenew = new UIButton( '⟳' ).setMarginLeft( '7px' ).onClick( function () {

		objectUUID.setValue( THREE.Math.generateUUID() );

		editor.selected.uuid = objectUUID.getValue();

	} );

	objectUUIDRow.add( new UIText( 'UUID' ).setWidth( '90px' ) );
	objectUUIDRow.add( objectUUID );
	objectUUIDRow.add( objectUUIDRenew );

	//container.add( objectUUIDRow );

	// name

	var objectNameRow = new UIRow();
	var objectName = new UIInput().setWidth( '150px' ).setColor( '#000' ).setFontSize( '12px' ).onChange( function () { // DFH

		editor.execute( new SetValueCommand( editor.selected, 'name', objectName.getValue() ) );

	} );

	objectNameRow.add( new UIText( 'Name' ).setWidth( '90px' ) );
	objectNameRow.add( objectName );

	container.add( objectNameRow );

	// parent

	var objectParentRow = new UIRow();
	var objectParent = new UISelect().setWidth( '150px' ).setColor( '#000' ).setFontSize( '12px' ).onChange( update ); // DFH

	objectParentRow.add( new UIText( 'Connect To' ).setWidth( '90px' ) );
	objectParentRow.add( objectParent );

	container.add( objectParentRow );

	// position

	var objectPositionRow = new UIRow();
	var objectPositionX = new UINumber().setWidth( '50px' ).onChange( update );
	var objectPositionY = new UINumber().setWidth( '50px' ).onChange( update );
	var objectPositionZ = new UINumber().setWidth( '50px' ).onChange( update );

	objectPositionRow.add( new UIText( 'Position' ).setWidth( '90px' ) );
	objectPositionRow.add( objectPositionX, objectPositionY, objectPositionZ );
	// DFH
	container.add( objectPositionRow );

	// rotation

	var objectRotationRow = new UIRow();
	var objectRotationX = new UINumber().setWidth( '50px' ).onChange( update );
	var objectRotationY = new UINumber().setWidth( '50px' ).onChange( update );
	var objectRotationZ = new UINumber().setWidth( '50px' ).onChange( update );

	objectRotationRow.add( new UIText( 'Rotation' ).setWidth( '90px' ) );
	objectRotationRow.add( objectRotationX, objectRotationY, objectRotationZ );

	container.add( objectRotationRow );

	// scale

	var objectScaleRow = new UIRow();
	var objectScaleLock = new UICheckbox().setPosition( 'absolute' ).setLeft( '75px' );
	var objectScaleX = new UINumber( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).onChange( updateScaleX );
	var objectScaleY = new UINumber( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).onChange( updateScaleY );
	var objectScaleZ = new UINumber( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).onChange( updateScaleZ );

	objectScaleRow.add( new UIText( 'Scale' ).setWidth( '90px' ) );
	objectScaleRow.add( objectScaleLock );
	objectScaleRow.add( objectScaleX, objectScaleY, objectScaleZ );

	container.add( objectScaleRow );

	// fov

	var objectFovRow = new UIRow();
	var objectFov = new UINumber().onChange( update );

	objectFovRow.add( new UIText( 'Fov' ).setWidth( '90px' ) );
	objectFovRow.add( objectFov );

	container.add( objectFovRow );

	// near

	var objectNearRow = new UIRow();
	var objectNear = new UINumber().onChange( update );

	objectNearRow.add( new UIText( 'Near' ).setWidth( '90px' ) );
	objectNearRow.add( objectNear );

	container.add( objectNearRow );

	// far

	var objectFarRow = new UIRow();
	var objectFar = new UINumber().onChange( update );

	objectFarRow.add( new UIText( 'Far' ).setWidth( '90px' ) );
	objectFarRow.add( objectFar );

	container.add( objectFarRow );

	// intensity

	var objectIntensityRow = new UIRow();
	var objectIntensity = new UINumber().setRange( 0, Infinity ).onChange( update );

	objectIntensityRow.add( new UIText( 'Intensity' ).setWidth( '90px' ) );
	objectIntensityRow.add( objectIntensity );

	container.add( objectIntensityRow );

	// color

	var objectColorRow = new UIRow();
	var objectColor = new UIColor().onChange( update );

	objectColorRow.add( new UIText( 'Color' ).setWidth( '90px' ) );
	objectColorRow.add( objectColor );

	container.add( objectColorRow );

	// ground color

	var objectGroundColorRow = new UIRow();
	var objectGroundColor = new UIColor().onChange( update );

	objectGroundColorRow.add( new UIText( 'Ground color' ).setWidth( '90px' ) );
	objectGroundColorRow.add( objectGroundColor );

	container.add( objectGroundColorRow );

	// distance

	var objectDistanceRow = new UIRow();
	var objectDistance = new UINumber().setRange( 0, Infinity ).onChange( update );

	objectDistanceRow.add( new UIText( 'Distance' ).setWidth( '90px' ) );
	objectDistanceRow.add( objectDistance );

	container.add( objectDistanceRow );

	// angle

	var objectAngleRow = new UIRow();
	var objectAngle = new UINumber().setPrecision( 3 ).setRange( 0, 90.0 ).onChange( update );

	objectAngleRow.add( new UIText( 'Angle (deg)' ).setWidth( '90px' ) );
	objectAngleRow.add( objectAngle );

	container.add( objectAngleRow );

	// penumbra

	var objectPenumbraRow = new UIRow();
	var objectPenumbra = new UINumber().setRange( 0, 1 ).onChange( update );

	objectPenumbraRow.add( new UIText( 'Penumbra' ).setWidth( '90px' ) );
	objectPenumbraRow.add( objectPenumbra );

	container.add( objectPenumbraRow );

	// decay

	var objectDecayRow = new UIRow();
	var objectDecay = new UINumber().setRange( 0, Infinity ).onChange( update );

	objectDecayRow.add( new UIText( 'Decay' ).setWidth( '90px' ) );
	objectDecayRow.add( objectDecay );

	container.add( objectDecayRow );

	// shadow

	var objectShadowRow = new UIRow();

	objectShadowRow.add( new UIText( 'Shadow' ).setWidth( '90px' ) );

	var objectCastShadow = new UICheckbox( false, 'cast' ).onChange( update );
	objectShadowRow.add( objectCastShadow );

	var objectReceiveShadow = new UICheckbox( false, 'receive' ).onChange( update );
	objectShadowRow.add( objectReceiveShadow );

	var objectShadowRadius = new UINumber( 1 ).onChange( update );
	objectShadowRow.add( objectShadowRadius );

	//container.add( objectShadowRow );

	// visible

	var objectVisibleRow = new UIRow();
	var objectVisible = new UICheckbox().setMarginLeft( '-31px' ).onChange( update ); // DFH

	objectVisibleRow.add( new UIText( 'Visible' ).setWidth( '90px' ) );
	objectVisibleRow.add( objectVisible );

	container.add( objectVisibleRow );

	// user data


	var objectUserDataRow = new UIRow();
	var objectUserData = new UITextArea().setWidth( '150px' ).setHeight( '40px' ).setColor( '#444' ).setFontSize( '12px' ).onChange( update );
	objectUserData.onKeyUp( function () {

		try {

			JSON.parse( objectUserData.getValue() );

			objectUserData.dom.classList.add( 'success' );
			objectUserData.dom.classList.remove( 'fail' );

		} catch ( error ) {

			objectUserData.dom.classList.remove( 'success' );
			objectUserData.dom.classList.add( 'fail' );

		}

	} );

	objectUserDataRow.add( new UIText( 'User data' ).setWidth( '90px' ) );
	objectUserDataRow.add( objectUserData );

	//container.add( objectUserDataRow );


	//

	function updateScaleX() {

		var object = editor.selected;

		if ( objectScaleLock.getValue() === true ) {

			var scale = objectScaleX.getValue() / object.scale.x;

			objectScaleY.setValue( objectScaleY.getValue() * scale );
			objectScaleZ.setValue( objectScaleZ.getValue() * scale );

		}

		update();

	}

	function updateScaleY() {

		var object = editor.selected;

		if ( objectScaleLock.getValue() === true ) {

			var scale = objectScaleY.getValue() / object.scale.y;

			objectScaleX.setValue( objectScaleX.getValue() * scale );
			objectScaleZ.setValue( objectScaleZ.getValue() * scale );

		}

		update();

	}

	function updateScaleZ() {

		var object = editor.selected;

		if ( objectScaleLock.getValue() === true ) {

			var scale = objectScaleZ.getValue() / object.scale.z;

			objectScaleX.setValue( objectScaleX.getValue() * scale );
			objectScaleY.setValue( objectScaleY.getValue() * scale );

		}

		update();

	}

	function update() {

		var object = editor.selected;

		if ( object !== null ) {

			if ( object.parent !== undefined ) { // DFH

				var newParentId = parseInt( objectParent.getValue() ); // DFH

				if ( object.parent.id !== newParentId && object.id !== newParentId ) { // DFH

					try_set_parent( editor, object, editor.scene.getObjectById( newParentId, true ) ); // DFH

					wing_update_children( signals, object.parent ); // DFH
					update_prop_controls( editor );

				}

			}

			object.position.x = objectPositionX.getValue();
			object.position.y = objectPositionY.getValue();
			object.position.z = objectPositionZ.getValue();

			object.rotation.x = objectRotationX.getValue() * Math.PI / 180.0; // DFH
			object.rotation.y = objectRotationY.getValue() * Math.PI / 180.0;
			object.rotation.z = objectRotationZ.getValue() * Math.PI / 180.0;
			object.rotation.order = 'ZYX';

			object.scale.x = objectScaleX.getValue();
			object.scale.y = objectScaleY.getValue();
			object.scale.z = objectScaleZ.getValue();

			if ( object.fov !== undefined ) {

				object.fov = objectFov.getValue();
				object.updateProjectionMatrix();

			}

			if ( object.near !== undefined ) {

				object.near = objectNear.getValue();

			}

			if ( object.far !== undefined ) {

				object.far = objectFar.getValue();

			}

			if ( object.intensity !== undefined ) {

				object.intensity = objectIntensity.getValue();

			}

			if ( object.color !== undefined ) {

				object.color.setHex( objectColor.getHexValue() );

			}

			if ( object.groundColor !== undefined ) {

				object.groundColor.setHex( objectGroundColor.getHexValue() );

			}

			if ( object.distance !== undefined ) {

				object.distance = objectDistance.getValue();

			}

			if ( object.angle !== undefined ) {

				object.angle = objectAngle.getValue() * Math.PI / 180.0; // DFH

			}

			if ( object.penumbra !== undefined ) { // DFH

				object.penumbra = objectPenumbra.getValue();

			}

			if ( object.decay !== undefined ) { // DFH

				object.decay = objectDecay.getValue();

			}

			if ( object.castShadow !== undefined ) { // DFH

				object.castShadow = objectCastShadow.getValue();

			}

			if ( object.receiveShadow !== undefined ) { // DFH

				object.receiveShadow = objectReceiveShadow.getValue();
				object.material.needsUpdate = true;

			}

			if ( object.shadow !== undefined ) { // DFH

				object.shadow = objectShadowRadius.getValue();

			}

			object.visible = objectVisible.getValue();

			try {

				object.userData = JSON.parse( objectUserData.getValue() );

			} catch ( exception ) {

				console.warn( exception );

			}

			signals.objectChanged.dispatch( object );

		}

	}

	function updateRows( object ) {

		var properties = {
			'parent': objectParentRow, // DFH
			'fov': objectFovRow,
			'near': objectNearRow,
			'far': objectFarRow,
			'intensity': objectIntensityRow,
			'color': objectColorRow,
			'groundColor': objectGroundColorRow,
			'distance': objectDistanceRow,
			'angle': objectAngleRow,
			'penumbra': objectPenumbraRow,
			'decay': objectDecayRow,
			'castShadow': objectShadowRow,
			'receiveShadow': objectReceiveShadow,
			'shadow': objectShadowRadius
		};

		for ( var property in properties ) {

			properties[ property ].setDisplay( object[ property ] !== undefined ? '' : 'none' );

		}

	}

	function updateTransformRows( object ) {

		objectNameRow.setDisplay( '' );
		objectParentRow.setDisplay( '' );
		objectPositionRow.setDisplay( '' );
		objectRotationRow.setDisplay( '' );
		objectScaleRow.setDisplay( '' );
		objectVisibleRow.setDisplay( '' );

		if ( object instanceof THREE.Light ||
		   ( object instanceof THREE.Object3D && object.userData.targetInverse ) ) {

			objectRotationRow.setDisplay( 'none' );
			objectScaleRow.setDisplay( 'none' );

		} else {

			if ( object.geometry !== undefined ) { // DFH

				if ( object.name == "Center of Gravity" ) { // DFH

					objectNameRow.setDisplay( 'none' );
					objectParentRow.setDisplay( 'none' );
					objectRotationRow.setDisplay( 'none' );
					objectScaleRow.setDisplay( 'none' );

				}

				if ( object.name == "Aerodynamic Center" ) { // DFH

					objectNameRow.setDisplay( 'none' );
					objectParentRow.setDisplay( 'none' );
					objectPositionRow.setDisplay( 'none' );
					objectRotationRow.setDisplay( 'none' );
					objectScaleRow.setDisplay( 'none' );
					objectVisibleRow.setDisplay( 'none' );

				}

				if ( object.geometry.type == "WingGeometry" ) { // DFH

					objectRotationRow.setDisplay( 'none' );
					objectScaleRow.setDisplay( 'none' );

				}

				if ( object.geometry.type == "PropGeometry" ) { // DFH

					objectScaleRow.setDisplay( 'none' );

				}


			} else { // DFH origin or group

				objectRotationRow.setDisplay( 'none' );
				objectScaleRow.setDisplay( 'none' );

				if ( object.name == "Camera" ) { // DFH

					objectNameRow.setDisplay( 'none' );
					objectParentRow.setDisplay( 'none' );
					objectPositionRow.setDisplay( 'none' );
					objectFovRow.setDisplay( 'none' );
					objectNearRow.setDisplay( 'none' );
					objectFarRow.setDisplay( 'none' );
					objectVisibleRow.setDisplay( 'none' );

				}

			}

		}

	}

	// events

	signals.objectSelected.add( function ( object ) {

		if ( object !== null ) {

			container.setDisplay( 'block' );

			updateRows( object );
			updateUI( object );

		} else {

			container.setDisplay( 'none' );

		}

	} );

	signals.sceneGraphChanged.add( function () {

		var scene = editor.scene;
		var options = {};

		scene.traverse( function ( object ) {

			options[ object.id ] = object.name;

		} );

		objectParent.setOptions( options );

	} );

	signals.objectChanged.add( function ( object ) {

		if ( object !== editor.selected ) return;

		updateUI( object );

	} );

	function updateUI( object ) {

		if ( object.parent !== null ) { // DFH

			objectParent.setValue( object.parent.id );

		}

		objectType.setValue( object.type );

		objectUUID.setValue( object.uuid );
		objectName.setValue( object.name );

		objectPositionX.setValue( object.position.x );
		objectPositionY.setValue( object.position.y );
		objectPositionZ.setValue( object.position.z );

		objectRotationX.setValue( object.rotation.x * 180.0 / Math.PI ); // DFH
		objectRotationY.setValue( object.rotation.y * 180.0 / Math.PI );
		objectRotationZ.setValue( object.rotation.z * 180.0 / Math.PI );

		objectScaleX.setValue( object.scale.x );
		objectScaleY.setValue( object.scale.y );
		objectScaleZ.setValue( object.scale.z );

		if ( object.fov !== undefined ) {

			objectFov.setValue( object.fov );

		}

		if ( object.near !== undefined ) {

			objectNear.setValue( object.near );

		}

		if ( object.far !== undefined ) {

			objectFar.setValue( object.far );

		}

		if ( object.intensity !== undefined ) {

			objectIntensity.setValue( object.intensity );

		}

		if ( object.color !== undefined ) {

			objectColor.setHexValue( object.color.getHexString() );

		}

		if ( object.groundColor !== undefined ) {

			objectGroundColor.setHexValue( object.groundColor.getHexString() );

		}

		if ( object.distance !== undefined ) {

			objectDistance.setValue( object.distance );

		}

		if ( object.angle !== undefined ) {

			objectAngle.setValue( object.angle * 180.0 / Math.PI ); // DFH

		}

		if ( object.penumbra !== undefined ) {

			objectPenumbra.setValue( object.penumbra );

		}

		if ( object.decay !== undefined ) {

			objectDecay.setValue( object.decay );

		}

		if ( object.castShadow !== undefined ) {

			objectCastShadow.setValue( object.castShadow );

		}

		if ( object.receiveShadow !== undefined ) {

			objectReceiveShadow.setValue( object.receiveShadow );

		}

		if ( object.shadow !== undefined ) {

			objectShadowRadius.setValue( object.shadow.radius );

		}

		objectVisible.setValue( object.visible );

		try {

			objectUserData.setValue( JSON.stringify( object.userData, null, '  ' ) );

		} catch ( error ) {

			console.log( error );

		}

		objectUserData.setBorderColor( '#ccc' );
		objectUserData.setBackgroundColor( '' );

		updateTransformRows( object );

	}

	return container;

}

export { SidebarObject3D };
