import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadTransactions } from '../actions/transactions';
import Transaction from '../components/transaction';

class Week extends Component {
	componentWillMount() {
		this.props.loadTransactions(this.props.offset);
	}
	render() {
		const { transactions } = this.props;
		return (
			<div className="weekly">
				<h3 />
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
					{transactions.map(tx => {
						return <Transaction {...tx} />;
					})}
					<tbody />
				</table>
			</div>
		);
	}
}

Week.propTypes = {
	offset: PropTypes.number.isRequired,
	transactions: PropTypes.array
};

Week.defaultProps = {
	transactions: []
};

function mapStateToProps(state, ownProps) {
	return {
		transactions: state.transactions[ownProps.offset]
	};
}

export default connect(mapStateToProps, {
	loadTransactions
})(Week);
