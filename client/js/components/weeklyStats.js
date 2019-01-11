import React from 'react';
import PropTypes from 'prop-types';
import money from '../util/money';
import Popover from 'react-bootstrap/lib/Popover';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import moment from 'moment-timezone';

function WeeklyStats(props) {
	const { label, weekId, stats, carriedOvers } = props;
	const carriedOversByCategory = carriedOvers.reduce((txnsByCat, txn) => {
		if (!txnsByCat[txn.category]) {
			txnsByCat[txn.category] = [txn];
		} else {
			txnsByCat[txn.category].push(txn);
		}
		return txnsByCat;
	}, {});
	return (
		<div className="stats">
			{label && <h4>{label}</h4>}
			<table className="table">
				<tbody>
					{stats.map(stat => {
						const { slug, label, amount } = stat;
						const carriedTxns = carriedOversByCategory[slug] || [];
						const statId = `${slug}-${weekId}`;
						const popover = (
							<Popover
								id={`carried-${statId}`}
								title="Carried-over transactions"
							>
								{carriedTxns.map(txn => {
									return (
										<li key={txn.id}>
											{moment(txn.date).format('MM/DD')}{' '}
											{money(txn.amount)} {txn.merchant}
										</li>
									);
								})}
							</Popover>
						);
						return (
							<tr key={statId} className="stat" data-cat={slug}>
								<OverlayTrigger
									trigger="click"
									overlay={popover}
								>
									<td id={statId}>
										<span className="legend">&nbsp;</span>
										{label}
									</td>
								</OverlayTrigger>
								<td aria-labelledby={statId}>
									{money(amount)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

WeeklyStats.propTypes = {
	label: PropTypes.string,
	weekId: PropTypes.string.isRequired,
	stats: PropTypes.array,
	carriedOvers: PropTypes.array
};

export default WeeklyStats;
