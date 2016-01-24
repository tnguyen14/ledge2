import React, { PropTypes } from 'react';
import Input from './Input';
import $ from 'jquery';
import 'typeahead.js';
import Bloodhound from 'typeahead.js/dist/bloodhound';

function createTypeaheadInput (Input) {
	const InputTypeahead = React.createClass({
		propTypes: {
			label: PropTypes.string,
			source: PropTypes.array
		},

		getInputField (ref) {
			this.input = ref;
		},

		initiateTypeahead () {
			$(this.input).typeahead({
				highlight: true
			}, {
				name: this.props.label,
				source: new Bloodhound({
					datumTokenizer: Bloodhound.tokenizers.whitespace,
					queryTokenizer: Bloodhound.tokenizers.whitespace,
					local: this.props.source
				})
			});
		},

		componentDidUpdate () {
			if (this.props.source.length) {
				this.initiateTypeahead();
			}
		},

		componentWillUpdate (nextProps) {
			// remove typeahead so that it can be initialized again in componentDidUpdate
			if (nextProps.source.length) {
				$(this.input).typeahead('destroy');
			}
		},

		render () {
			return <Input inputCallback={this.getInputField} {...this.props}/>;
		}
	});

	return InputTypeahead;
}

export default createTypeaheadInput(Input);
