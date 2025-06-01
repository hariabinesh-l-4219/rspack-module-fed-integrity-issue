import './render.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

export function render() {
    const el = document.createElement('div')
    el.classList.add('text')
    document.getElementsByTagName('body')[0].appendChild(el)
    el.innerHTML = 'hello, world'
}

window.aa = {
    React,
    ReactDOM,
}