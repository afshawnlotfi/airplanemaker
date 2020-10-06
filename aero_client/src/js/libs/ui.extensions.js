import { UIPanel } from './ui.js';


// Collapsible Panel

function UICollapsiblePanel() {

	UIPanel.call( this );

	this.setClass( 'Panel Collapsible' );

	var scope = this;

	this.static = new UIPanel();
	this.static.setClass( 'Static' );
	this.static.onClick( function () {

		scope.toggle();

	} );
	this.dom.appendChild( this.static.dom );

	this.contents = new UIPanel();
	this.contents.setClass( 'Content' );
	this.dom.appendChild( this.contents.dom );

	var button = new UIPanel();
	button.setClass( 'Button' );
	this.static.add( button );

	this.isCollapsed = false;

	return this;

}

UICollapsiblePanel.prototype = Object.create( UIPanel.prototype );
UICollapsiblePanel.prototype.constructor = UICollapsiblePanel;

UICollapsiblePanel.prototype.addStatic = function () {

	this.static.add.apply( this.static, arguments );
	return this;

};

UICollapsiblePanel.prototype.removeStatic = function () {

	this.static.remove.apply( this.static, arguments );
	return this;

};

UICollapsiblePanel.prototype.clearStatic = function () {

	this.static.clear();
	return this;

};

UICollapsiblePanel.prototype.add = function () {

	this.contents.add.apply( this.contents, arguments );
	return this;

};

UICollapsiblePanel.prototype.remove = function () {

	this.contents.remove.apply( this.contents, arguments );
	return this;

};

UICollapsiblePanel.prototype.clear = function () {

	this.contents.clear();
	return this;

};

UICollapsiblePanel.prototype.toggle = function () {

	this.setCollapsed( ! this.isCollapsed );

};

UICollapsiblePanel.prototype.collapse = function () {

	this.setCollapsed( true );

};

UICollapsiblePanel.prototype.expand = function () {

	this.setCollapsed( false );

};

UICollapsiblePanel.prototype.setCollapsed = function ( boolean ) {

	if ( boolean ) {

		this.dom.classList.add( 'collapsed' );

	} else {

		this.dom.classList.remove( 'collapsed' );

	}

	this.isCollapsed = boolean;

	if ( this.onCollapsedChangeCallback !== undefined ) {

		this.onCollapsedChangeCallback( boolean );

	}

};

UICollapsiblePanel.prototype.onCollapsedChange = function ( callback ) {

	this.onCollapsedChangeCallback = callback;

};

export { UICollapsiblePanel };

