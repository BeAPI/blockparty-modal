/**
 * Registers the modal block and adds "Open modal on click" to blocks allowed as triggers.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType, getBlockTypes } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { useSelect, select } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ComboboxControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { modal } from '@beapi/icons';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 */
import './style.scss';

import Edit from './edit';
import save from './save';
import deprecated from './deprecated';
import metadata from './block.json';

import {
	MODAL_BLOCK_NAME,
	LINKED_MODAL_ATTR,
	getModalOptionsFromEditor,
	addLinkedModalAttribute,
} from './utils';

registerBlockType( metadata.name, {
	icon: modal,
	edit: Edit,
	save,
	deprecated,
} );

/**
 * Returns the list of block names allowed as modal triggers (same as filter blockparty_modal_trigger_allowed_blocks).
 * Used so we only add linkedModalId to those blocks.
 *
 * @return {string[]} Allowed block names.
 */
function getModalTriggerAllowedBlocks() {
	try {
		const settings = select( 'core/block-editor' ).getSettings();
		const list = settings?.blockpartyModalTriggerAllowedBlocks;
		return Array.isArray( list ) ? list : [ 'core/button' ];
	} catch {
		return [ 'core/button' ];
	}
}

// Add linkedModalId attribute only to blocks allowed as modal triggers.
addFilter(
	'blocks.registerBlockType',
	'blockparty-modal/add-linked-modal-attribute',
	( settings, blockName ) => {
		const allowedBlocks = getModalTriggerAllowedBlocks();
		if ( ! allowedBlocks.includes( blockName ) ) {
			return settings;
		}
		return addLinkedModalAttribute( settings );
	}
);

// Blocks registered before our script loaded (e.g. core blocks) didn't get the
// filter — re-register only allowed blocks so linkedModalId is persisted on save.
const allowedBlocks = getModalTriggerAllowedBlocks();
const blockTypes = getBlockTypes();
blockTypes.forEach( ( blockType ) => {
	if (
		allowedBlocks.includes( blockType.name ) &&
		! blockType.attributes?.[ LINKED_MODAL_ATTR ]
	) {
		registerBlockType(
			blockType.name,
			addLinkedModalAttribute( blockType )
		);
	}
} );

// Add "Attached modal" panel with Combobox only to blocks allowed as modal triggers (see filter blockparty_modal_trigger_allowed_blocks).
addFilter(
	'editor.BlockEdit',
	'blockparty-modal/with-modal-trigger-control',
	( BlockEdit ) => ( props ) => {
		const { name, attributes, setAttributes } = props;

		if ( name === MODAL_BLOCK_NAME ) {
			return <BlockEdit { ...props } />;
		}

		const triggerAllowedBlocks = useSelect( ( storeSelect ) => {
			const settings = storeSelect( 'core/block-editor' ).getSettings();
			const list = settings?.blockpartyModalTriggerAllowedBlocks;
			return Array.isArray( list ) ? list : [ 'core/button' ];
		}, [] );

		if ( ! triggerAllowedBlocks.includes( name ) ) {
			return <BlockEdit { ...props } />;
		}

		const modalOptions = useSelect( ( storeSelect ) => {
			return getModalOptionsFromEditor( storeSelect );
		}, [] );

		const options = [
			{ value: '', label: __( 'None', 'blockparty-modal' ) },
			...modalOptions,
		];

		const value = attributes[ LINKED_MODAL_ATTR ] || '';

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls key="blockparty-modal-trigger">
					<PanelBody
						title={ __( 'Attached modal', 'blockparty-modal' ) }
						initialOpen={ false }
					>
						<ComboboxControl
							label={ __(
								'Modal to open when block is clicked',
								'blockparty-modal'
							) }
							value={ value }
							options={ options }
							onChange={ ( newValue ) =>
								setAttributes( {
									[ LINKED_MODAL_ATTR ]: newValue || '',
								} )
							}
							placeholder={ __(
								'Select a modal…',
								'blockparty-modal'
							) }
						/>
					</PanelBody>
				</InspectorControls>
			</>
		);
	}
);
