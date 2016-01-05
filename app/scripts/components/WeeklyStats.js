import React from 'react';
import { money } from '../util/helpers.js';

export default function WeeklyStats (props) {
	return (
		<div className="summary">
			<div className="week-total">
				<h3>Week Total</h3>
				<div className="stat">
					<span className="value">{money(props.total)}</span>
				</div>
			</div>
			<div className="by-category">
				<h3>By category</h3>
				<div className="stat">
					{props.categoryTotals.map(function (total) {
						return (
							<div className="cat-total" key={total.slug}>
								<label htmlFor={total.slug}>{total.label}</label>{' '}
								<span id={total.slug}>{money(total.amount)}</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
