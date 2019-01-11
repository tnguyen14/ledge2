import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PulseLoader from 'react-spinners/PulseLoader';
import { removeTransaction, editTransaction } from '../actions/account';
import { loadTransactions } from '../actions/weeks';
import Transaction from '../components/transaction';
import WeeklyStats from '../components/weeklyStats';
import { calculateStats } from '../selectors/weeklyStats';

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
			editTransaction,
			options
		} = this.props;
		const stats = calculateStats(this.props);
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
						{transactions
							.filter(tx => {
								return !tx.carriedOver;
							})
							.map(tx => {
								return (
									<Transaction
										key={tx.id}
										handleRemove={removeTransaction}
										handleEdit={editTransaction}
										options={options}
										{...tx}
									/>
								);
							})}
					</tbody>
				</table>
				<WeeklyStats
					weekId={`week-${offset}`}
					stats={stats}
					carriedOvers={transactions.filter(tx => tx.carriedOver)}
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
	editTransaction: PropTypes.func,
	options: PropTypes.shape({
		categories: PropTypes.array,
		sources: PropTypes.array
	}),
	stats: PropTypes.array
};

function mapStateToProps(state) {
	return {
		options: {
			categories: state.account.categories,
			sources: state.account.sources
		}
	};
}

export default connect(
	mapStateToProps,
	{
		loadTransactions,
		removeTransaction,
		editTransaction
	}
)(Week);
