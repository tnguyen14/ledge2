import React from 'react';
import { money } from '../util/helpers.js';

export default function WeeklyStats (props) {
	return (
		<div className="summary">
			<div className="week-total">
				<h3>Week Total</h3>
				<div className="stat">
					<span className="value">{money(props.weekTotal)}</span>
				</div>
			</div>
			<div className="by-category">
				<h3>By category</h3>
				<div className="stat">
					{props.categoryTotals.map(function (total) {
						const id = total.slug + '-cat-total';
						return (
							<div className="cat-total" key={total.slug}>
								<label htmlFor={id}>{total.label}</label>{' '}
								<span id={id}>{money(total.amount)}</span>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
