import React from 'react';
import Week from './Week';

export default function Transactions (props) {
	return (
		<div className="transactions">
			{props.weeks.map(function (week, index) {
				return <Week key={index} data={week}/>;
			})}
		</div>
	);
}
