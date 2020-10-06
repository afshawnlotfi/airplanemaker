import * as THREE from '../../build/three.module.js';

export class GridHelper extends THREE.LineSegments {

	constructor( size, divisions, color1, color2 ) {

		size = size || 10;
		divisions = divisions || 10;
		color1 = new THREE.Color( color1 !== undefined ? color1 : 0x444444 );
		color2 = new THREE.Color( color2 !== undefined ? color2 : 0x888888 );

		const center = divisions / 2;
		const step = size / divisions;
		const halfSize = size / 2;

		const vertices = [], colors = [];

		for ( let i = 0, j = 0, k = - halfSize; i <= divisions; i ++, k += step ) {

			vertices.push( - halfSize, k, 0, halfSize, k, 0 ), // DFH
			vertices.push( k, - halfSize, 0, k, halfSize, 0 ); // DFH

			const color = i === center ? color1 : color2;

			color.toArray( colors, j ); j += 3;
			color.toArray( colors, j ); j += 3;
			color.toArray( colors, j ); j += 3;
			color.toArray( colors, j ); j += 3;

		}

		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
		geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

		const material = new THREE.LineBasicMaterial( { vertexColors: true, toneMapped: false } );

		super( geometry, material );

		this.type = 'GridHelper';

	}

}
