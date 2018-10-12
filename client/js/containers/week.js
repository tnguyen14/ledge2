import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PulseLoader from 'react-spinners/PulseLoader';
import { removeTransaction, editTransaction } from '../actions/account';
import { loadTransactions } from '../actions/weeks';
import Transaction from '../components/transaction';
import WeeklyStats from '../components/weeklyStats';

class Week extends Component {
	componentDidMount() {
		// load transactions
		this.props.loadTransactions(this.props.offset);
	}
	render() {
		const {
			offset,
			isLoading,
			visible,
			transactions,
			start,
			end,
			removeTransaction,
			editTransaction
		} = this.props;
		if (!visible) {
			return null;
		}
		return (
			<div className="weekly">
				<h3 className="week-title">
					{start.format('MMM D')} - {end.format('MMM D')}
				</h3>
				<table className="weekly-transactions table table-striped">
					<thead>
						<tr>
							<th data-field="day">Day</th>
							<th data-field="merchant">Merchant</th>
							<th data-field="amount">Amount</th>
							<th data-field="source">Source</th>
							<th data-field="description" className="secondary">
								Desc.
							</th>
							<th data-field="category" className="secondary">
								Category
							</th>
							<th className="secondary" />
						</tr>
						<tr className="addition" />
					</thead>
					<tbody>
						{transactions.map(tx => {
							return (
								<Transaction
									key={tx.id}
									handleRemove={removeTransaction}
									handleEdit={editTransaction}
									{...tx}
								/>
							);
						})}
					</tbody>
				</table>
				<WeeklyStats
					weekId={`week-${offset}`}
					transactions={transactions}
				/>
				<PulseLoader
					className="transactions-loading"
					loading={isLoading}
				/>
			</div>
		);
	}
}

Week.propTypes = {
	offset: PropTypes.number.isRequired,
	isLoading: PropTypes.bool,
	visible: PropTypes.bool,
	transactions: PropTypes.array,
	start: PropTypes.object,
	end: PropTypes.object,
	loadTransactions: PropTypes.func,
	removeTransaction: PropTypes.func,
	editTransaction: PropTypes.func
};

export default connect(
	null,
	{
		loadTransactions,
		removeTransaction,
		editTransaction
	}
)(Week);
