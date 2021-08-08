import { system } from './src/modules/system.js';
import { field } from './src/modules/field.js';

const app = document.querySelector('#app');
const gameSystem = Object.create(system);
const gameField = Object.create(field);

gameField.init(app);
gameSystem.init(gameField);
