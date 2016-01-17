import React, { PropTypes } from 'react';
import Week from './Week';

export default function Transactions (props) {
	return (
		<div className="transactions">
			{props.weeks.map(function (week, index) {
				return <Week key={week} transactions={props.transactions} offset={week} onEditClick={props.onEditClick} onDeleteClick={props.onDeleteClick}/>;
			})}
		</div>
	);
}

Transactions.propTypes = {
	weeks: PropTypes.array.isRequired,
	transactions: PropTypes.array.isRequired,
	onEditClick: PropTypes.func.isRequired,
	onDeleteClick: PropTypes.func.isRequired
};
