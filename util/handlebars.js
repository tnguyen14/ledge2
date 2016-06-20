import {date, money, getCategory, getSource, slugify} from './helpers';
import helpers from 'handlebars-helpers';
import Handlebars from 'hbsfy/runtime';

helpers({
	handlebars: Handlebars
});

Handlebars.registerHelper({
	'date': date,
	'money': money,
	'getCategory': getCategory,
	'getSource': getSource,
	'slugify': slugify
});
