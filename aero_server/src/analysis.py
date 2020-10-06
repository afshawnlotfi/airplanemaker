import machup.MU as MU
from machup import Airplane


def getThrust(blades = 2, pitch = 0.4, hub_diameter =  0.1, diameter = 1.0):

    prop_dict = {
        "name": "Prop_1",
        "position": {
            "dx": 0,
            "dy": 0,
            "dz": 0
        },
        "orientation": {
            "elevation_angle": 0,
            "heading_angle": 0
        },
        "radial_nodes": 50,
        "diameter": diameter,
        "hub_diameter": hub_diameter,
        "num_of_blades": blades,
        "rotation_direction": "CCW",
        "pitch": {
            "type": "value",
            "value": pitch
        },
        "chord": {
            "type": "linear",
                    "root": 0.1,
                    "tip": 0.02
        },
        "electric_motor": {
            "has_motor": True,
            "motor_kv": 2100,
            "gear_reduction": 1,
            "motor_resistance": 0.108,
            "motor_no_load_current": 0.6,
            "battery_resistance": 0.0094,
            "battery_voltage": 11.1,
            "speed_control_resistance": 0.0038
        },
        "airfoils": {
            "af1": {
                "properties": {
                    "type": "linear",
                            "alpha_L0": -0.036899751,
                            "CL_alpha": 6.283185307,
                            "Cm_L0": -0.0527,
                            "Cm_alpha": -0.08,
                            "CD0": 0.0055,
                            "CD0_L": -0.0045,
                            "CD0_L2": 0.01,
                            "CL_max": 1.4
                }
            },
            "af2": {
                "properties": {
                    "type": "linear",
                            "alpha_L0": -0.036899751,
                            "CL_alpha": 6.283185307,
                            "Cm_L0": -0.0527,
                            "Cm_alpha": -0.08,
                            "CD0": 0.0055,
                            "CD0_L": -0.0045,
                            "CD0_L2": 0.01,
                            "CL_max": 1.4
                }
            }
        }
    }

    airplane = Airplane()
    airplane._units = "English"
    airplane.add_prop(prop_dict["name"],
                        position=[prop_dict["position"]["dx"],
                                prop_dict["position"]["dy"],
                                prop_dict["position"]["dz"]],
                        orientation = [prop_dict["orientation"]["elevation_angle"],
                                    prop_dict["orientation"]["heading_angle"]],
                        nodes=prop_dict["radial_nodes"],
                        diameter=prop_dict["diameter"],
                        hub_diameter=prop_dict["hub_diameter"],
                        num_of_blades=prop_dict["num_of_blades"],
                        rot_dir=prop_dict["rotation_direction"],
                        pitch_info=prop_dict["pitch"],
                        chord_info=prop_dict["chord"],
                        electric_motor = prop_dict.get("electric_motor",{}),
                        airfoils=prop_dict["airfoils"])


    muAirplane = MU.MachUp(inputAirplane=airplane)

    prop_state = {
        "all_have_motor": True,
        "Prop_1": {
            "electric_throttle": 1
        },
        "electric_throttle": 1,
        "rot_per_sec": 30,
        "individual_control": False
    }

    # muAirplane.create_stl()

    FM = muAirplane.solve(prop_state=prop_state)
    return FM["FX"]

