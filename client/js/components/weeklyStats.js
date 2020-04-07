import React from 'react';
import PropTypes from 'prop-types';
import WeeklyStat from './weeklyStat';

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
					{stats.map((stat) => {
						const { slug, label, amount } = stat;
						return (
							<WeeklyStat
								key={slug}
								slug={slug}
								label={label}
								amount={amount}
								weekId={weekId}
								carriedOvers={carriedOversByCategory[slug]}
							/>
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
