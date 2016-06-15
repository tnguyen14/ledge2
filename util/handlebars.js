import { date, money, getCategory, getSource } from './helpers';
import helpers from 'handlebars-helpers';
import Handlebars from 'hbsfy/runtime';

helpers({
	handlebars: Handlebars
});

Handlebars.registerHelper('date', date);
Handlebars.registerHelper('money', money);
Handlebars.registerHelper('getCategory', getCategory);
Handlebars.registerHelper('getSource', getSource);
