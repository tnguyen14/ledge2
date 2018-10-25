import React from 'react';
import PropTypes from 'prop-types';
import money from '../util/money';

function WeeklyStats(props) {
	const { label, weekId, stats } = props;
	return (
		<div className="stats">
			{label && <h4>{label}</h4>}
			<table className="table">
				<tbody>
					{stats.map(stat => {
						const { slug, label, amount } = stat;
						const statId = `${slug}-${weekId}`;
						return (
							<tr key={statId} className="stat" data-cat={slug}>
								<td id={statId}>
									<span className="legend">&nbsp;</span>
									{label}
								</td>
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
	stats: PropTypes.array
};

export default WeeklyStats;
