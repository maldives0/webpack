import './style/main.scss';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import(/* webpackChunkName: "banana" */ './module')
  .then(function (banana) {
    banana.init();
  })
  .catch(function (err) {
    console.error('module error', err);
  });

const form = document.createElement('form');
document.body.append(form);
const input = document.createElement('input');
input.type = 'number';
form.append(input);
const button = document.createElement('button');
button.textContent = '입력';
form.append(button);
const div = document.createElement('div');
div.textContent = banana;
form.append(div);
