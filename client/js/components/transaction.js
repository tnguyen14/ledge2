import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import Badge from 'react-bootstrap/lib/Badge';
import money from '../util/money';
import classnames from 'classnames';
import Octicon, { Pencil, X } from '@githubprimer/octicons-react';

function getValueFromOptions(options, slug) {
	let option = options.find(opt => opt.slug === slug);
	if (option) {
		return option.value;
	}
}

class Transaction extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		date: PropTypes.string.isRequired,
		amount: PropTypes.number.isRequired,
		merchant: PropTypes.string.isRequired,
		category: PropTypes.string.isRequired,
		source: PropTypes.string.isRequired,
		description: PropTypes.string,
		handleEdit: PropTypes.func.isRequired,
		handleRemove: PropTypes.func.isRequired,
		options: PropTypes.shape({
			categories: PropTypes.array,
			sources: PropTypes.array
		})
	};

	constructor(props) {
		super(props);
		this.state = { active: false };
	}

	toggleActive = () => {
		this.setState({
			active: !this.state.active
		});
	};

	render() {
		const {
			id,
			date,
			amount,
			merchant,
			category,
			source,
			description,
			handleEdit,
			handleRemove,
			options
		} = this.props;
		const { active } = this.state;
		const displayDate = moment(date).format('ddd');
		return (
			<tr
				className={classnames('transaction', {
					'table-active': active
				})}
				onClick={this.toggleActive}
				data-day={displayDate}
			>
				<td data-field="day">{displayDate}</td>
				<td data-field="merchant">{merchant}</td>
				<td data-field="amount" data-cat={category}>
					<Badge pill>{money(amount)}</Badge>
				</td>
				<td data-field="source">
					{getValueFromOptions(options.sources, source)}
				</td>
				<td data-field="description">{description}</td>
				<td data-field="category">
					{getValueFromOptions(options.categories, category)}
				</td>
				<td data-field="action">
					<a className="edit" onClick={handleEdit(id)}>
						<Octicon icon={Pencil} />
					</a>
					<a className="remove" onClick={handleRemove(id)}>
						<Octicon icon={X} />
					</a>
				</td>
			</tr>
		);
	}
}

export default Transaction;
