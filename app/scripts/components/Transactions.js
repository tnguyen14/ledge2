import React from 'react';
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
