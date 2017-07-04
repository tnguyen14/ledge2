import React from 'react';

function Transaction(props) {
	const { amount, merchant } = props;
	return (
		<tr>
			<td>
				{merchant}
			</td>
		</tr>
	);
}

export default Transaction;
