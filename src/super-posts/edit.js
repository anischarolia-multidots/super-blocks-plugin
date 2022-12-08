/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

import { useEffect } from "react";
/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";
import { useSelect, select } from "@wordpress/data";
import ServerSideRender from "@wordpress/server-side-render";
import { SelectControl, RangeControl, PanelBody, ToggleControl, ColorPalette, BaseControl } from "@wordpress/components";
import { useState } from "@wordpress/element";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit(props) {


	const {
		attributes: {
			postType,
			orderBy,
			order,
			postNum,
			showExcerpt,
			bgColor,
			textColor,
			showButton,
			layout,
			showImage,
			headingTag
		},
		setAttributes,
		className,
	} = props;

	const blockProps = useBlockProps();

	const { getPostTypes } = select('core');

	const postTypes = getPostTypes();

	console.log(postTypes);

	const postTypeObject = postTypes?.filter(
		(type) => {
			if (true === type.viewable && 'Media' !== type.name) {
				return true
			}
		}
	);

	const options = postTypeObject?.map((ele) => {
		return {
			value: ele.slug,
			label: ele.name,
		};
	})

	options?.unshift({ value: '', label: 'Select Post Type' });

	const colors = [
		{ name: 'red', color: '#f00' },
		{ name: 'white', color: '#fff' },
		{ name: 'blue', color: '#00f' },
	];

	return (
		<>
			<InspectorControls key="setting">
				<PanelBody title="Post Type Settings" initialOpen={true}>
					<SelectControl
						label="Post Type"
						value={postType}
						options={options}
						onChange={(newType) => setAttributes({ postType: newType })}
					/>
					{postType && (
						<>
							<SelectControl
								label="Order"
								value={order}
								options={[
									{ label: 'ASC', value: 'ASC' },
									{ label: 'DESC', value: 'DESC' },
								]}
								onChange={(newOrder) => setAttributes({ order: newOrder })}
							/>

							<SelectControl
								label="Order By"
								value={orderBy}
								options={[
									{ label: 'ID', value: 'ID' },
									{ label: 'Title', value: 'title' },
									{ label: 'Date', value: 'date' },
									{ label: 'Modified', value: 'modified' },
									{ label: 'Comment Count', value: 'comment_count' },
								]}
								onChange={(newOrder) => setAttributes({ orderBy: newOrder })}
							/>

							<ToggleControl
								label="Show Image"
								help={
									showImage
										? 'Image Visible.'
										: 'Image Hidden.'
								}
								checked={showImage}
								onChange={() => setAttributes({ showImage: !showImage })}
							/>

							<ToggleControl
								label="Show Excerpt"
								help={
									showExcerpt
										? 'Excerpt Visible.'
										: 'Excerpt Hidden.'
								}
								checked={showExcerpt}
								onChange={() => setAttributes({ showExcerpt: !showExcerpt })}
							/>

							<ToggleControl
								label="Show View Post Button"
								help={
									showButton
										? 'Button Visible.'
										: 'Button Hidden.'
								}
								checked={showButton}
								onChange={() => setAttributes({ showButton: !showButton })}
							/>

							<RangeControl
								label="No. Of Posts"
								value={postNum}
								onChange={(newOrder) => setAttributes({ postNum: newOrder })}
								min={1}
								max={50}
							/>
						</>
					)
					}
				</PanelBody>

				<PanelBody title="UI Settings" initialOpen={false}>

					<SelectControl
						label="Layout"
						value={layout}
						options={[
							{ label: 'Row', value: 'row' },
							{ label: 'Column', value: 'column' },
						]}
						onChange={(newLayout) => setAttributes({ layout: newLayout })}
					/>

					<SelectControl
						label="Heading Tag"
						value={headingTag}
						options={[
							{ label: 'H1', value: 'h1' },
							{ label: 'H2', value: 'h2' },
							{ label: 'H3', value: 'h3' },
							{ label: 'H4', value: 'h4' },
							{ label: 'H5', value: 'h5' },
							{ label: 'H6', value: 'h6' },							
						]}
						onChange={(newheadingTag) => setAttributes({ headingTag: newheadingTag })}
					/>

					<BaseControl
						className="editor-color-palette-control"
						label="Background Color">
						<ColorPalette
							colors={colors}
							value={bgColor}
							onChange={(newColor) => setAttributes({ bgColor: newColor })}
						/>
					</BaseControl>

					<BaseControl
						className="editor-color-palette-control"
						label="Text Color">
						<ColorPalette
							colors={colors}
							value={textColor}
							onChange={(newColor) => setAttributes({ textColor: newColor })}
						/>
					</BaseControl>

				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<ServerSideRender
					block="super-posts/super-blocks"
					attributes={
						{
							postType: postType,
							order: order,
							orderBy: orderBy,
							postNum: postNum,
							showExcerpt: showExcerpt,
							bgColor: bgColor,
							textColor: textColor,
							showButton: showButton,
							layout: layout,
							showImage: showImage,
							headingTag: headingTag,
						}
					}
				/>
			</div>
		</>
	);
}
