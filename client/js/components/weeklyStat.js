import React from 'react';
import PropTypes from 'prop-types';
import money from '../util/money';
import Popover from 'react-bootstrap/lib/Popover';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import moment from 'moment-timezone';
import Octicon, { Clock } from '@githubprimer/octicons-react';

function WeeklyStat(props) {
	const { slug, label, amount, weekId, carriedOvers } = props;
	const statId = `${slug}-${weekId}`;
	const popover = (
		<Popover id={`carried-${statId}`} title="Carried-over transactions">
			{carriedOvers.map(txn => {
				return (
					<li key={txn.id}>
						{moment(txn.date).format('MM/DD')} {money(txn.amount)}{' '}
						{txn.merchant}
					</li>
				);
			})}
		</Popover>
	);
	return (
		<tr key={statId} className="stat" data-cat={slug}>
			{carriedOvers.length ? (
				<OverlayTrigger trigger="click" overlay={popover}>
					<td id={statId} className={`stat-label carried-over`}>
						<span className="legend">&nbsp;</span>
						{label}
						<span className="span-hint">
							<Octicon icon={Clock} />
						</span>
					</td>
				</OverlayTrigger>
			) : (
				<td id={statId} className="stat-label">
					<span className="legend">&nbsp;</span>
					{label}
				</td>
			)}
			<td aria-labelledby={statId}>{money(amount)}</td>
		</tr>
	);
}

WeeklyStat.propTypes = {
	slug: PropTypes.string,
	label: PropTypes.string,
	amount: PropTypes.number,
	weekId: PropTypes.string,
	carriedOvers: PropTypes.array
};

WeeklyStat.defaultProps = {
	carriedOvers: []
};

export default WeeklyStat;
