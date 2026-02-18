<?php
// This file is generated. Do not modify it manually.
return array(
	'blockparty-modal' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'blockparty/modal',
		'version' => '1.0.1',
		'title' => 'Modal',
		'category' => 'widgets',
		'description' => 'Insert a modal dialog that opens on trigger. Configure content and behaviour in the editor; the modal is displayed on the frontend when activated.',
		'attributes' => array(
			'headingLevel' => array(
				'type' => 'number',
				'default' => 2
			),
			'title' => array(
				'type' => 'string',
				'default' => ''
			),
			'content' => array(
				'type' => 'string',
				'default' => ''
			),
			'modalId' => array(
				'type' => 'string',
				'default' => ''
			),
			'closedBy' => array(
				'type' => 'string',
				'default' => 'any',
				'enum' => array(
					'any',
					'closerequest',
					'none'
				)
			),
			'enableCloseButton' => array(
				'type' => 'boolean',
				'default' => true
			),
			'displayIconOnly' => array(
				'type' => 'boolean',
				'default' => false
			),
			'preventScroll' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'example' => array(
			
		),
		'supports' => array(
			'align' => array(
				'wide',
				'full'
			),
			'dimensions' => array(
				'height' => true,
				'minHeight' => true
			),
			'color' => array(
				'background' => true,
				'text' => true
			),
			'spacing' => array(
				'padding' => true,
				'blockGap' => true
			),
			'html' => false
		),
		'textdomain' => 'blockparty-modal',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	)
);
