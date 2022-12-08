/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

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
import { useSelect } from "@wordpress/data";
import ServerSideRender from "@wordpress/server-side-render";
import { SelectControl, CheckboxControl, PanelBody, TextControl, ToggleControl } from "@wordpress/components";
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
	const blockProps = useBlockProps();

	const [searchName, setSearchName] = useState('');


	const {
		attributes: { taxname, terms, update, heading, showHeading },
		setAttributes,
	} = props;

	let newArray = terms;

	const onChangeTax = (newContent) => {
		terms.splice(0, terms.length);
		setAttributes({ taxname: newContent });
	};

	const onChangeTerms = (newArray) => {
		setAttributes({ terms: newArray });
	};

	const termList = useSelect(
		(select) => {
			return select("core").getEntityRecords("taxonomy", taxname, {
				per_page: 100,
				hide_empty: true,
			});
		},
		[taxname]
	);

	const checkIfchecked = (id) => {
		if (terms.includes(id)) {
			return true;
		}
		return false
	};

	const addTerm = (id) => {
		if (newArray.includes(id)) {
			const index = newArray.indexOf(id);
			if (index > -1) {
				// only splice array when item is found
				newArray.splice(index, 1); // 2nd parameter means remove one item only
			}

		} else {
			newArray = newArray.concat(id);
		}
		onChangeTerms(newArray);
		checkIfchecked(id);

	};

	return (
		<>
			<InspectorControls key="setting">
				<PanelBody title="Terms Settings" initialOpen={true}>
					<ToggleControl
						label="Show Heading"
						help={
							showHeading
								? 'Button Visible.'
								: 'Button Hidden.'
						}
						checked={showHeading}
						onChange={() => setAttributes({ showHeading: !showHeading })}
					/>
					{showHeading && (
						<TextControl
							label="Add Heading Text"
							value={heading}
							onChange={(newHeadingText) => setAttributes({ heading: newHeadingText })}
						/>
					)}
					<SelectControl
						label="Taxonomy Name"
						value={taxname}
						options={[
							{ label: "Select Taxonomy", value: "" },
							{ label: "Category", value: "category" },
						]}
						onChange={onChangeTax}
					/>

					<div class="dsb-terms-checkbox-wrap">
						{termList
							? (termList.map((v) => {
								return (

									<CheckboxControl
										label={v.name}
										checked={checkIfchecked(v.id)}
										onChange={() => {
											addTerm(v.id);
											setAttributes({
												update: !update
											});
										}}
									/>

								);
							})
							) : null}
					</div>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<ServerSideRender
					block="terms/super-blocks"
					attributes={{
						taxname: taxname,
						terms: terms,
						update: update,
						heading: heading,
						showHeading: showHeading
					}}
				/>
			</div>
		</>
	);
}
