import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { money, getSource, getCategory } from '../../util/helpers';

function Transaction(props) {
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
	} = props;
	const displayDate = moment(date).format('ddd');
	return (
		<tr className="transaction" data-day={displayDate}>
			<td className="day">
				{displayDate}
			</td>
			<td className="merchant">
				{merchant}
			</td>
			<td className="amount" data-cat={category}>
				<span className="badge">
					{money(amount)}
				</span>
			</td>
			<td className="source">
				{getSource(source)}
			</td>
			<td className="description">
				{description}
			</td>
			<td className="category">
				{getCategory(category)}
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

Transaction.propTypes = {
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

export default Transaction;
