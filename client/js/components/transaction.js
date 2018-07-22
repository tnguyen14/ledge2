import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import money from '../util/money';
import config from 'config';
import classnames from 'classnames';

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
		handleRemove: PropTypes.func.isRequired
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
			handleRemove
		} = this.props;
		const { active } = this.state;
		const displayDate = moment(date).format('ddd');
		return (
			<tr
				className={classnames('transaction', { active })}
				onClick={this.toggleActive}
				data-day={displayDate}
			>
				<td className="day">{displayDate}</td>
				<td className="merchant">{merchant}</td>
				<td className="amount" data-cat={category}>
					<span className="badge">{money(amount)}</span>
				</td>
				<td className="source">
					{getValueFromOptions(config.sources, source)}
				</td>
				<td className="description">{description}</td>
				<td className="category">
					{getValueFromOptions(config.categories, category)}
				</td>
				<td className="action">
					<i
						className="edit glyphicon glyphicon-pencil"
						onClick={handleEdit(id)}
					/>
					<i
						className="remove glyphicon glyphicon-remove"
						onClick={handleRemove(id)}
					/>
				</td>
			</tr>
		);
	}
}

export default Transaction;
