import './style/main.scss';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import(/* webpackChunkName: "module" */ './module')
  .then(function (res) {
    const p = document.createElement('p');
    p.textContent = res.default;
    document.body.append(p);
  })
  .catch(function (err) {
    console.error('module error', err);
  });

const div = document.createElement('div');
document.body.append(div);
