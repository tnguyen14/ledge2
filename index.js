import Handlebars from 'hbsfy/runtime';
import helpers from 'handlebars-helpers';
import {render as formRender} from './components/form';

helpers({
	handlebars: Handlebars
});

formRender('.main');
