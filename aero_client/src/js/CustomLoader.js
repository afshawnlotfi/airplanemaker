import * as THREE from '../../build/three.module.js';
import { THREEWingGeometry, THREEPropGeometry } from './MU.js';

var Geometries = /*#__PURE__*/Object.freeze( {
	__proto__: null,
	WireframeGeometry: THREE.WireframeGeometry,
	ParametricGeometry: THREE.ParametricGeometry,
	ParametricBufferGeometry: THREE.ParametricBufferGeometry,
	TetrahedronGeometry: THREE.TetrahedronGeometry,
	TetrahedronBufferGeometry: THREE.TetrahedronBufferGeometry,
	OctahedronGeometry: THREE.OctahedronGeometry,
	OctahedronBufferGeometry: THREE.OctahedronBufferGeometry,
	IcosahedronGeometry: THREE.IcosahedronGeometry,
	IcosahedronBufferGeometry: THREE.IcosahedronBufferGeometry,
	DodecahedronGeometry: THREE.DodecahedronGeometry,
	DodecahedronBufferGeometry: THREE.DodecahedronBufferGeometry,
	PolyhedronGeometry: THREE.PolyhedronGeometry,
	PolyhedronBufferGeometry: THREE.PolyhedronBufferGeometry,
	TubeGeometry: THREE.TubeGeometry,
	TubeBufferGeometry: THREE.TubeBufferGeometry,
	TorusKnotGeometry: THREE.TorusKnotGeometry,
	TorusKnotBufferGeometry: THREE.TorusKnotBufferGeometry,
	TorusGeometry: THREE.TorusGeometry,
	TorusBufferGeometry: THREE.TorusBufferGeometry,
	TextGeometry: THREE.TextGeometry,
	TextBufferGeometry: THREE.TextBufferGeometry,
	SphereGeometry: THREE.SphereGeometry,
	SphereBufferGeometry: THREE.SphereBufferGeometry,
	RingGeometry: THREE.RingGeometry,
	RingBufferGeometry: THREE.RingBufferGeometry,
	PlaneGeometry: THREE.PlaneGeometry,
	PlaneBufferGeometry: THREE.PlaneBufferGeometry,
	LatheGeometry: THREE.LatheGeometry,
	LatheBufferGeometry: THREE.LatheBufferGeometry,
	ShapeGeometry: THREE.ShapeGeometry,
	ShapeBufferGeometry: THREE.ShapeBufferGeometry,
	ExtrudeGeometry: THREE.ExtrudeGeometry,
	ExtrudeBufferGeometry: THREE.ExtrudeBufferGeometry,
	EdgesGeometry: THREE.EdgesGeometry,
	ConeGeometry: THREE.ConeGeometry,
	ConeBufferGeometry: THREE.ConeBufferGeometry,
	CylinderGeometry: THREE.CylinderGeometry,
	CylinderBufferGeometry: THREE.CylinderBufferGeometry,
	CircleGeometry: THREE.CircleGeometry,
	CircleBufferGeometry: THREE.CircleBufferGeometry,
	BoxGeometry: THREE.BoxGeometry,
	BoxBufferGeometry: THREE.BoxBufferGeometry
} );

export const parse = ( obj, json, onLoad ) => {

	var shapes = obj.parseShape( json.shapes );
	var geometries = parseGeometries( obj, json.geometries, shapes );

	var images = obj.parseImages( json.images, function () {

		if ( onLoad !== undefined ) {

			onLoad( object );

		}

	} );

	var textures = obj.parseTextures( json.textures, images );
	var materials = obj.parseMaterials( json.materials, textures );

	var object = obj.parseObject( json.object, geometries, materials );

	if ( json.animations ) {

		object.animations = obj.parseAnimations( json.animations );

	}

	if ( json.images === undefined || json.images.length === 0 ) {

		if ( onLoad !== undefined ) {

			onLoad( object );

		}

	}

	return object;

};


export const parseGeometries = ( obj, json, shapes ) => {

	var geometries = {};
	var geometryShapes;

	if ( json !== undefined ) {

		var bufferGeometryLoader = new THREE.BufferGeometryLoader();

		for ( var i = 0, l = json.length; i < l; i ++ ) {

			var geometry = ( void 0 );
			var data = json[ i ];
			switch ( data.type ) {

				case 'PlaneGeometry':
				case 'PlaneBufferGeometry':

					geometry = new Geometries[ data.type ](
						data.width,
						data.height,
						data.widthSegments,
						data.heightSegments
					);

					break;

				case 'BoxGeometry':
				case 'BoxBufferGeometry':
				case 'CubeGeometry': // backwards compatible

					geometry = new Geometries[ data.type ](
						data.width,
						data.height,
						data.depth,
						data.widthSegments,
						data.heightSegments,
						data.depthSegments
					);

					break;

				case 'CircleGeometry':
				case 'CircleBufferGeometry':

					geometry = new Geometries[ data.type ](
						data.radius,
						data.segments,
						data.thetaStart,
						data.thetaLength
					);

					break;

				case 'CylinderGeometry':
				case 'CylinderBufferGeometry':

					geometry = new Geometries[ data.type ](
						data.radiusTop,
						data.radiusBottom,
						data.height,
						data.radialSegments,
						data.heightSegments,
						data.openEnded,
						data.thetaStart,
						data.thetaLength
					);

					break;

				case 'ConeGeometry':
				case 'ConeBufferGeometry':

					geometry = new Geometries[ data.type ](
						data.radius,
						data.height,
						data.radialSegments,
						data.heightSegments,
						data.openEnded,
						data.thetaStart,
						data.thetaLength
					);

					break;

				case 'SphereGeometry':
				case 'SphereBufferGeometry':

					geometry = new Geometries[ data.type ](
						data.radius,
						data.widthSegments,
						data.heightSegments,
						data.phiStart,
						data.phiLength,
						data.thetaStart,
						data.thetaLength
					);

					break;

				case 'DodecahedronGeometry':
				case 'DodecahedronBufferGeometry':
				case 'IcosahedronGeometry':
				case 'IcosahedronBufferGeometry':
				case 'OctahedronGeometry':
				case 'OctahedronBufferGeometry':
				case 'TetrahedronGeometry':
				case 'TetrahedronBufferGeometry':

					geometry = new Geometries[ data.type ](
						data.radius,
						data.detail
					);

					break;

				case 'RingGeometry':
				case 'RingBufferGeometry':

					geometry = new Geometries[ data.type ](
						data.innerRadius,
						data.outerRadius,
						data.thetaSegments,
						data.phiSegments,
						data.thetaStart,
						data.thetaLength
					);

					break;

				case 'TorusGeometry':
				case 'TorusBufferGeometry':

					geometry = new Geometries[ data.type ](
						data.radius,
						data.tube,
						data.radialSegments,
						data.tubularSegments,
						data.arc
					);

					break;

				case 'WingGeometry': // DFH
					var left_start = new THREE.Vector3( data.left_start.x, data.left_start.y, data.left_start.z );
					var right_start = new THREE.Vector3( data.right_start.x, data.right_start.y, data.right_start.z );

					geometry = new THREEWingGeometry(
						{
							...data,
							left_start,
							right_start
						}
					);

					break;

				case 'PropGeometry': // DFH

					geometry = new THREEPropGeometry(
						data.nblades,
						data.rotation,
						data.diameter,
						data.pitch,
						data.hub_radius,
						data.root_chord,
						data.tip_chord,
						data.elliptical,
						data.root_airfoil,
						data.tip_airfoil,
						data.electric_motor,
						data.nSeg,
						data.nAFseg,
						data.same_as_root
					);

					break;


				case 'TorusKnotGeometry':
				case 'TorusKnotBufferGeometry':

					geometry = new Geometries[ data.type ](
						data.radius,
						data.tube,
						data.tubularSegments,
						data.radialSegments,
						data.p,
						data.q
					);

					break;

				case 'TubeGeometry':
				case 'TubeBufferGeometry':

					// This only works for built-in curves (e.g. CatmullRomCurve3).
					// User defined curves or instances of CurvePath will not be deserialized.
					geometry = new Geometries[ data.type ](
						new THREE.Curves[ data.path.type ]().fromJSON( data.path ),
						data.tubularSegments,
						data.radius,
						data.radialSegments,
						data.closed
					);

					break;

				case 'LatheGeometry':
				case 'LatheBufferGeometry':

					geometry = new Geometries[ data.type ](
						data.points,
						data.segments,
						data.phiStart,
						data.phiLength
					);

					break;

				case 'PolyhedronGeometry':
				case 'PolyhedronBufferGeometry':

					geometry = new Geometries[ data.type ](
						data.vertices,
						data.indices,
						data.radius,
						data.details
					);

					break;

				case 'ShapeGeometry':
				case 'ShapeBufferGeometry':

					geometryShapes = [];

					for ( var j = 0, jl = data.shapes.length; j < jl; j ++ ) {

						var shape = shapes[ data.shapes[ j ] ];

						geometryShapes.push( shape );

					}

					geometry = new Geometries[ data.type ](
						geometryShapes,
						data.curveSegments
					);

					break;


				case 'ExtrudeGeometry':
				case 'ExtrudeBufferGeometry':

					geometryShapes = [];

					for ( var j$1 = 0, jl$1 = data.shapes.length; j$1 < jl$1; j$1 ++ ) {

						var shape$1 = shapes[ data.shapes[ j$1 ] ];

						geometryShapes.push( shape$1 );

					}

					var extrudePath = data.options.extrudePath;

					if ( extrudePath !== undefined ) {

						data.options.extrudePath = new THREE.Curves[ extrudePath.type ]().fromJSON( extrudePath );

					}

					geometry = new Geometries[ data.type ](
						geometryShapes,
						data.options
					);

					break;

				case 'BufferGeometry':
				case 'InstancedBufferGeometry':

					geometry = bufferGeometryLoader.parse( data );

					break;

				case 'Geometry':

					console.error( 'THREE.ObjectLoader: Loading "Geometry" is not supported anymore.' );

					break;

				default:

					console.warn( 'THREE.ObjectLoader: Unsupported geometry type "' + data.type + '"' );

					continue;

			}

			geometry.uuid = data.uuid;

			if ( data.name !== undefined ) {

				geometry.name = data.name;

			}

			if ( geometry.isBufferGeometry === true && data.userData !== undefined ) {

				geometry.userData = data.userData;

			}

			geometries[ data.uuid ] = geometry;

		}

	}

	return geometries;

};
