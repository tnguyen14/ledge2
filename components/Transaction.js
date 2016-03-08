import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Badge } from 'react-bootstrap';
import { date as getDate, money, getSource, getCategory } from '../util/helpers';

const Transaction = React.createClass({
	propTypes: {
		data: PropTypes.object.isRequired,
		onEditClick: PropTypes.func.isRequired,
		onDeleteClick: PropTypes.func.isRequired
	},

	getInitialState () {
		return {
			active: false
		};
	},

	handleClick () {
		this.setState({
			active: !this.state.active
		});
	},

	render () {
		const { data: { id, date, merchant, category, amount, source, description }, onEditClick, onDeleteClick } = this.props;
		return (
			<tr className={classNames('transaction', {active: this.state.active})} data-transaction-id={id} data-day={getDate('ddd', date)} onClick={this.handleClick}>
				<td className="day">{getDate('ddd', date)}</td>
				<td className="merchant">{merchant}</td>
				<td className="amount" data-cat={category}><Badge>{money(amount)}</Badge></td>
				<td className="source">{getSource(source)}</td>
				<td className="description">{description}</td>
				<td className="category">{getCategory(category)}</td>
				<td className="action">
					<i className="edit glyphicon glyphicon-pencil" onClick={onEditClick.bind(this, id)}></i>
					<i className="remove glyphicon glyphicon-remove" onClick={onDeleteClick.bind(this, id)}></i>
				</td>
			</tr>
		);
	}
});

export default Transaction;
