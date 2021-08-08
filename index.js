import { system } from './src/modules/system.js';
import { field } from './src/modules/field.js';

const app = document.querySelector('#app');
const gameSystem = Object.create(system);
const gameField = Object.create(field);

gameSystem.init();
gameField.init(app, gameSystem);

gameSystem.createUnit(200, 200);
gameSystem.createUnit(300, 200);
gameSystem.createUnit(400, 200);
gameSystem.createUnit(500, 200);
gameSystem.createUnit(600, 200);
