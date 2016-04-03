import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

export default function LoadMore (props) {
	return (
		<Button bsStyle="success" onClick={props.onClick}>Show more</Button>
	);
}

LoadMore.propTypes = {
	onClick: PropTypes.func
};
