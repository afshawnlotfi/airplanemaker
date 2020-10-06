import * as THREE from '../../build/three.module.js';

const intialSceneName = "Scene";

const wing_defaults = {
	is_main: true,
	side: "both",
	span: 4.0,
	sweep: 0.0,
	dihedral: 0.0,
	mount: 0.0,
	washout: 0.0,
	root_chord: 1.0,
	tip_chord: 1.0,
	root_airfoil: {
		"NACA 2412": {
			"properties": {
				"type": "linear",
				"alpha_L0": - 0.036899751,
				"CL_alpha": 6.283185307,
				"Cm_L0": - 0.0527,
				"Cm_alpha": - 0.08,
				"CD0": 0.0055,
				"CD0_L": - 0.0045,
				"CD0_L2": 0.01,
				"CL_max": 1.4
			}
		}
	},
	tip_airfoil: {
		"NACA 2412": {
			"properties": {
				"type": "linear",
				"alpha_L0": - 0.036899751,
				"CL_alpha": 6.283185307,
				"Cm_L0": - 0.0527,
				"Cm_alpha": - 0.08,
				"CD0": 0.0055,
				"CD0_L": - 0.0045,
				"CD0_L2": 0.01,
				"CL_max": 1.4
			}
		}
	},
	nSeg: 40,
	ribNum: 5,
	nAFseg: 50,
	left_start: new THREE.Vector3( 0.0, 0.0, 0.0 ),
	right_start: new THREE.Vector3( 0.0, 0.0, 0.0 ),
	dy: 0.0,
	control: {
		has_control_surface: false,
		span_root_rib: 1,
		span_tip_rib: 3,
		chord_root: 0.2,
		chord_tip: 0.2,
		is_sealed: 1,
		mix: {
			elevator: 1.0,
			rudder: 0.0,
			aileron: 0.0,
			flap: 0.0
		}
	},
	same_as_root: true,

};


function Config() {

	var name = 'threejs-editor';

	var storage = {
		'language': 'en',
		'exportPrecision': 6,

		'autosave': true,

		'project/title': '',
		'project/editable': false,
		'project/vr': false,

		'project/renderer/antialias': true,
		'project/renderer/shadows': true,
		'project/renderer/shadowType': 1, // PCF
		'project/renderer/physicallyCorrectLights': false,
		'project/renderer/toneMapping': 0, // NoToneMapping
		'project/renderer/toneMappingExposure': 1,

		'settings/history': false,

		'settings/shortcuts/translate': 'w',
		'settings/shortcuts/rotate': 'e',
		'settings/shortcuts/scale': 'r',
		'settings/shortcuts/undo': 'z',
		'settings/shortcuts/focus': 'f'
	};

	if ( window.localStorage[ name ] === undefined ) {

		window.localStorage[ name ] = JSON.stringify( storage );

	} else {

		var data = JSON.parse( window.localStorage[ name ] );

		for ( var key in data ) {

			storage[ key ] = data[ key ];

		}

	}

	return {

		getKey: function ( key ) {

			return storage[ key ];

		},

		setKey: function () { // key, value, key, value ...

			for ( var i = 0, l = arguments.length; i < l; i += 2 ) {

				storage[ arguments[ i ] ] = arguments[ i + 1 ];

			}

			window.localStorage[ name ] = JSON.stringify( storage );

			console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Saved config to LocalStorage.' );

		},

		clear: function () {

			delete window.localStorage[ name ];

		}

	};

}

export { Config, intialSceneName, wing_defaults };
