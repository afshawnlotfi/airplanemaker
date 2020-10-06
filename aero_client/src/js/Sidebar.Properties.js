import { UITabbedPanel } from './libs/ui.js';

import { SidebarObject3D } from './Sidebar.Object3D.js';
import { SidebarGeometry } from './Sidebar.Geometry.js';
import { SidebarMaterial } from './Sidebar.Material.js';

function SidebarProperties( editor ) {

	var strings = editor.strings;

	var container = new UITabbedPanel();
	container.setId( 'properties' );

	container.addTab( 'object', strings.getKey( 'sidebar/properties/object' ), new SidebarObject3D( editor ) );
	container.addTab( 'geometry', strings.getKey( 'sidebar/properties/geometry' ), new SidebarGeometry( editor ) );
	container.addTab( 'material', strings.getKey( 'sidebar/properties/material' ), new SidebarMaterial( editor ) );
	container.select( 'object' );

	return container;

}

export { SidebarProperties };
