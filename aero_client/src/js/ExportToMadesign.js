const Wing = {
	"tag": {
		"UUID": "41C4B84C-F04B-4CE5-A6D9-D97A1EABCE10",
		"date": "2020-08-31T17:35:42.367Z",
		"version": "MachUp 5.0"
	},
	"run": {
		"forces": ""
	},
	"solver": {
		"type": "linear",
		"convergence": 0.000001,
		"relaxation": 0.9
	},
	"plane": {
		"name": "Airplane",
		"CGx": 0,
		"CGy": 0,
		"CGz": 0
	},
	"reference": {
		"area": 0,
		"longitudinal_length": 0,
		"lateral_length": 0
	},
	"condition": {
		"units": "SI",
		"velocity": 10,
		"density": 1.225,
		"alpha": 0,
		"beta": 0
	},
	"controls": {
		"elevator": {
			"is_symmetric": 1,
			"deflection": 100
		},
		"rudder": {
			"is_symmetric": 0,
			"deflection": - 0.02
		},
		"aileron": {
			"is_symmetric": 0,
			"deflection": 10
		},
		"flap": {
			"is_symmetric": 1,
			"deflection": 0
		}
	},
	"prop_controls": {
		"rot_per_sec": 30,
		"electric_throttle": 1,
		"individual_control": false
	},
	"airfoil_DB": ".",
	"wings": {
		"Wing_1": {
			"name": "Wing_1",
			"ID": 1,
			"is_main": 1,
			"side": "both",
			"connect": {
				"ID": 0,
				"location": "tip",
				"dx": 0,
				"dy": 0,
				"dz": 0,
				"yoffset": 0
			},
			"span": 4,
			"sweep": 0,
			"dihedral": 0,
			"mounting_angle": 0,
			"washout": 0,
			"root_chord": 1,
			"tip_chord": 1,
			"airfoils": {
				"af1": {
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
				},
				"af2": {
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
			"grid": 40,
			"control": {
				"has_control_surface": true,
				"span_root_rib": 1,
				"span_tip_rib": 3,
				"chord_root": 0.2,
				"chord_tip": 0.2,
				"is_sealed": 1,
				"mix": {
					"elevator": 1,
					"rudder": 0,
					"aileron": 0,
					"flap": 0
				},
				"span_root": 0.2,
				"span_tip": 0.6
			},
			"sameAsRoot": true
		}
	},
	"propellers": {}


};





export const sampleMadTemplate = ( design ) => {

	const cf = design.condition.units === "SI" ? 1000 : 12; // conversion factor
	return {
		overview: {
			MADversion: "2.0",
			author: "",
			description: "Auto-generated",
			email: "",
			name: "Example 12",
			plans_height: "36",
			plans_width: "24",
			sheet_height: "12",
			sheet_width: "24",
			units: design.condition.units === "SI" ? "mm" : "in",
		},
		wing: Object.keys( design.wings ).map( ( wing ) => {

			const rib_num = wing.rib_num;
			const rib_increments = ( wing.span * cf ) / rib_num;
			const stations = Array.from( Array( rib_num + 1 ).keys() ).map( i => i * rib_increments );
			return {
				airfoil_root: "clarky",
				airfoil_tip: "",
				chord_curve: "",
				sweep_curve: "",
				chord_root: ( wing.root_chord * cf ).toString(),
				chord_tip: ( wing.tip_chord * cf ).toString(),
				dihedral: wing.dihedral.toString(),
				name: wing.name.toString(),
				span: ( wing.span * cf ).toString(),
				twist: wing.washout.toString(),
				sweep: wing.sweep.toString(),
				stations: stations.join( " " ),
				wing_link: "none",

				leading_edge: [
					{
						size: "0.25",
						end_station: "",
						start_station: "",
					},
				],

				trailing_edge: [
					{
						height: "0.325",
						width: "0.75",
						shape: "Flat Triangle",
						start_station: "",
						end_station: "",

					},
				],

				flap: [
					{
						angle: "55",
						width: "0.25",
						height: "0.125",
						position: ( 1.0 - wing.control.chord_root ).toString(),
						position_ref: "Chord %",
						start_station: `Start: ${stations[ wing.control.span_root_rib ]}`,
						end_station: `Start: ${stations[ wing.control.span_tip_rib ]}`,
						slope: "",
						at_station: "",
					}
				],

				stringer: [
					{
						start_station: "",
						end_station: "",
						width: "0.2",
						height: "0.2",
						position: "0.15",
						position_ref: "Chord %",
						surface: "Top",
					},
					{
						start_station: "",
						end_station: "",
						width: "0.2",
						height: "0.2",
						position: "0.15",
						position_ref: "Chord %",
						surface: "Bottom",
					},
				],


				spar: [
					{
						start_station: "Start: Inner",
						end_station: "End: Outer",
						width: "0.25",
						height: "0.25",
						position: "0.33",
						position_ref: "Chord %",
						surface: "Top",
					},
					{
						start_station: "",
						end_station: "",
						width: "0.25",
						height: "0.25",
						position: "0.33",
						position_ref: "Chord %",
						surface: "Bottom",
					},
				],

			};

		} )


	};

};
