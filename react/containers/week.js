import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadTransactions } from '../actions/transactions';
import Transaction from '../components/transaction';
import WeeklyStats from '../components/weeklyStats';

class Week extends Component {
	componentWillMount() {
		// load transactions
		this.props.loadTransactions(this.props.offset);
	}
	render() {
		const { offset, transactions, start, end } = this.props;
		return (
			<div className="weekly">
				<h3>
					{start.format('MMM D')} - {end.format('MMM D')}
				</h3>
				<table className="weekly-transactions table table-striped">
					<thead>
						<tr>
							<th>Day</th>
							<th>Merchant</th>
							<th>Amount</th>
							<th>Source</th>
							<th className="secondary">Desc.</th>
							<th className="secondary">Category</th>
							<th className="secondary" />
						</tr>
						<tr className="addition" />
					</thead>
					<tbody>
						{transactions.map(tx => {
							return <Transaction key={tx.id} {...tx} />;
						})}
					</tbody>
				</table>
				<WeeklyStats weekId={`week-${offset}`} transactions={transactions} />
			</div>
		);
	}
}

Week.propTypes = {
	offset: PropTypes.number.isRequired,
	transactions: PropTypes.array,
	start: PropTypes.object,
	end: PropTypes.object,
	loadTransactions: PropTypes.func
};

export default connect(null, {
	loadTransactions
})(Week);
