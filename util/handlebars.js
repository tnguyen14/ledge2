import { date, money } from './helpers';
import helpers from 'handlebars-helpers';
import Handlebars from 'hbsfy/runtime';

helpers({
	handlebars: Handlebars
});

Handlebars.registerHelper('date', date);
Handlebars.registerHelper('money', money);
