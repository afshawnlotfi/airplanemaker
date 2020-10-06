import { UIPanel, UISpan, UIText, UIDiv } from './libs/ui.js';

import { SidebarScene } from './Sidebar.Scene.js';
import { SidebarProperties } from './Sidebar.Properties.js';
import { SidebarCondition } from './Sidebar.Condition.js';
import { SidebarAnimation } from './Sidebar.Animation.js';
import { SidebarProject } from './Sidebar.Project.js';
import { SidebarHistory } from './Sidebar.History.js';
import { SidebarSettings } from './Sidebar.Settings.js';
import { SidebarAnalysis } from './Sidebar.Analysis.js';

function Sidebar( editor ) {

	var container = new UIPanel();
	container.setId( 'sidebar' );

	//

	var sceneTab = new UIText( 'PARTS' ).onClick( onClick );
	var conditionTab = new UIText( 'CONDITION' ).onClick( onClick );
	var projectTab = new UIText( 'ANALYSIS' ).onClick( onClick );
	var settingsTab = new UIText( 'SETTINGS' ).onClick( onClick );

	var tabs = new UIDiv();
	tabs.setId( 'tabs' );
	tabs.add( sceneTab, conditionTab, projectTab ); //to add settings tab insert, settingsTab here
	container.add( tabs );

	function onClick( event ) {

		select( event.target.textContent );

	}

	//

	var scene = new UISpan().add(
		new SidebarScene( editor ), //Components tree
		new SidebarProperties( editor ), //object, geometry, and material tabs or various objects
		new SidebarAnimation( editor ) //Animation display is currently set to 'none', so its invisible
	);
	container.add( scene );

	var condition = new UISpan().add(
		new SidebarCondition( editor )
	);
	container.add( condition );

	var project = new UISpan().add(
		new SidebarAnalysis( editor ),
		new SidebarProject( editor )
	);
	container.add( project );

	//setting tab is not currently in tabs
	var settings = new UISpan().add(
		new SidebarSettings( editor ),
		new SidebarHistory( editor )
	);
	container.add( settings );

	//

	function select( section ) {

		sceneTab.setClass( '' );
		conditionTab.setClass( '' );
		projectTab.setClass( '' );
		settingsTab.setClass( '' );

		scene.setDisplay( 'none' );
		condition.setDisplay( 'none' );
		project.setDisplay( 'none' );
		settings.setDisplay( 'none' );

		switch ( section ) {

			case 'PARTS':
				sceneTab.setClass( 'selected' );
				scene.setDisplay( '' );
				break;
			case 'CONDITION':
				conditionTab.setClass( 'selected' );
				condition.setDisplay( '' );
				break;
			case 'ANALYSIS':
				projectTab.setClass( 'selected' );
				project.setDisplay( '' );
				break;
			case 'SETTINGS':
				settingsTab.setClass( 'selected' );
				settings.setDisplay( '' );
				break;

		}

	}

	select( 'PARTS' );

	return container;

}

export { Sidebar };
