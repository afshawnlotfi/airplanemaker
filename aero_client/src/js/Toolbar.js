import { UIPanel, UIButton, UICheckbox } from './libs/ui.js';

function Toolbar( editor ) {

	var signals = editor.signals;
	var strings = editor.strings;

	var container = new UIPanel();
	container.setId( 'toolbar' );

	// translate / rotate / scale

	var translateIcon = document.createElement( 'img' );
	translateIcon.title = strings.getKey( 'toolbar/translate' );
	translateIcon.src = 'images/translate.svg';

	var translate = new UIButton();
	translate.dom.className = 'Button selected';
	translate.dom.appendChild( translateIcon );
	translate.onClick( function () {

		signals.transformModeChanged.dispatch( 'translate' );

	} );
	container.add( translate );

	var rotateIcon = document.createElement( 'img' );
	rotateIcon.title = strings.getKey( 'toolbar/rotate' );
	rotateIcon.src = 'images/rotate.svg';

	var rotate = new UIButton();
	rotate.dom.appendChild( rotateIcon );
	rotate.onClick( function () {

		signals.transformModeChanged.dispatch( 'rotate' );

	} );
	container.add( rotate );

	var scaleIcon = document.createElement( 'img' );
	scaleIcon.title = strings.getKey( 'toolbar/scale' );
	scaleIcon.src = 'images/scale.svg';

	var scale = new UIButton();
	scale.dom.appendChild( scaleIcon );
	scale.onClick( function () {

		signals.transformModeChanged.dispatch( 'scale' );

	} );
	container.add( scale );

	var local = new UICheckbox( false );
	local.dom.title = strings.getKey( 'toolbar/local' );
	local.onChange( function () {

		signals.spaceChanged.dispatch( this.getValue() === true ? 'local' : 'world' );

	} );
	container.add( local );

	//

	signals.transformModeChanged.add( function ( mode ) {

		translate.dom.classList.remove( 'selected' );
		rotate.dom.classList.remove( 'selected' );
		scale.dom.classList.remove( 'selected' );

		switch ( mode ) {

			case 'translate': translate.dom.classList.add( 'selected' ); break;
			case 'rotate': rotate.dom.classList.add( 'selected' ); break;
			case 'scale': scale.dom.classList.add( 'selected' ); break;

		}

	} );

	// grid




	function updateButtons( object ) {

		if ( object instanceof THREE.Light ||
		 ( object instanceof THREE.Object3D && object.userData.targetInverse ) ) {

			 rotate.setDisplay( 'none' );
			 scale.setDisplay( 'none' );

		 } else {

			 if ( object.geometry !== undefined ) { // DFH

					 if ( object.name == "Center of Gravity" ) { // DFH

							 rotate.setDisplay( 'none' );
							 scale.setDisplay( 'none' );

				}

					 if ( object.name == "Aerodynamic Center" ) { // DFH

							 translate.setDisplay( 'none' );
							 rotate.setDisplay( 'none' );
							 scale.setDisplay( 'none' );

				}

					 if ( object.geometry.type == "WingGeometry" ) { // DFH

							 rotate.setDisplay( 'none' );
							 scale.setDisplay( 'none' );

				}

					 if ( object.geometry.type == "PropGeometry" ) { // DFH

							 scale.setDisplay( 'none' );

				}

					 if ( object.geometry.type == "PlaneBufferGeometry" ) { // DFH

						 translate.setDisplay( 'inline-block' );
						 rotate.setDisplay( 'inline-block' );
						 scale.setDisplay( 'inline-block' );

				}

					 if ( object.geometry.type == "BoxBufferGeometry" ) { // DFH

						 translate.setDisplay( 'inline-block' );
						 rotate.setDisplay( 'inline-block' );
						 scale.setDisplay( 'inline-block' );

				}

					 if ( object.geometry.type == "CircleBufferGeometry" ) { // DFH

						 translate.setDisplay( 'inline-block' );
						 rotate.setDisplay( 'inline-block' );
						 scale.setDisplay( 'inline-block' );

				}

					 if ( object.geometry.type == "CylinderBufferGeometry" ) { // DFH

						 translate.setDisplay( 'inline-block' );
						 rotate.setDisplay( 'inline-block' );
						 scale.setDisplay( 'inline-block' );

				}

					 if ( object.geometry.type == "SphereBufferGeometry" ) { // DFH

						 translate.setDisplay( 'inline-block' );
						 rotate.setDisplay( 'inline-block' );
						 scale.setDisplay( 'inline-block' );

				}

					 if ( object.geometry.type == "TorusBufferGeometry" ) { // DFH

						 translate.setDisplay( 'inline-block' );
						 rotate.setDisplay( 'inline-block' );
						 scale.setDisplay( 'inline-block' );

				}

					 signals.transformModeChanged.dispatch( 'translate' );

		 } else { // DFH origin or group

				translate.setDisplay( 'inline-block' ); // DFH
				rotate.setDisplay( 'inline-block' ); // DFH
				scale.setDisplay( 'inline-block' ); // DFh

		 }

		}

	}

	// events

	signals.objectSelected.add( function ( object ) { // DFH

		if ( object !== null ) {

			updateButtons( object );

		}

	} );

	return container;

}

export { Toolbar };
