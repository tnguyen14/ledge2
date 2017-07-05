import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadTransactions } from '../actions/transactions';
import { loadWeek } from '../actions/weeks';
import Transaction from '../components/transaction';

class Week extends Component {
	componentWillMount() {
		// load week first to instantiate week object
		this.props.loadWeek(this.props.offset);
		// load transactions
		this.props.loadTransactions(this.props.offset);
	}
	render() {
		const { transactions, start, end } = this.props;
		let dateRange;
		if (start && end) {
			dateRange = `${start.format('MMM D')} - ${end.format('MMM D')}`;
		}
		return (
			<div className="weekly">
				<h3>
					{dateRange}
				</h3>
				<table className="weekly-transactions table table-striped">
					<thead>
						<tr>
							<th>Day</th>
							<th>Merchant</th>
							<th>Amount</th>
							<th>Source</th>
							<th class="secondary">Desc.</th>
							<th class="secondary">Category</th>
							<th class="secondary" />
						</tr>
						<tr className="addition" />
					</thead>
					<tbody>
						{transactions.map(tx => {
							return <Transaction {...tx} />;
						})}
					</tbody>
				</table>
			</div>
		);
	}
}

Week.propTypes = {
	offset: PropTypes.number.isRequired,
	transactions: PropTypes.array,
	start: PropTypes.object,
	end: PropTypes.object
};

Week.defaultProps = {
	transactions: []
};

function mapStateToProps(state, ownProps) {
	return {
		...state.weeks[ownProps.offset]
	};
}

export default connect(mapStateToProps, {
	loadTransactions,
	loadWeek
})(Week);
