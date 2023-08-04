import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { DndProvider } from 'react-dnd';
import App from './App';
import { HTML5Backend } from 'react-dnd-html5-backend';

ReactDOM.render(
  <DndProvider backend={HTML5Backend}>
    <App />
    </DndProvider>,
  document.getElementById('root')
);