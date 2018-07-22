import jwtDecode from 'jwt-decode';
import pick from 'lodash.pick';

// claims that are relevant
const userClaims = [
	'given_name',
	'family_name',
	'nickname',
	'name',
	'picture',
	'sub'
];
// decode user info from idToken
export default function getUser(idToken) {
	const payload = jwtDecode(idToken);
	return pick(payload, userClaims);
}
