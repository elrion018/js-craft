import { system } from './src/modules/system.js';
import { field } from './src/modules/field.js';
import { timer } from './src/modules/timer.js';

const app = document.querySelector('#app');
const gameSystem = Object.create(system);
const gameTimer = Object.create(timer);
const gameField = Object.create(field);

gameTimer.timerInit();
gameTimer.start();
gameSystem.systemInit(gameTimer);
gameField.fieldInit(app, gameSystem);

gameSystem.createUnit(200, 200);
gameSystem.createUnit(300, 200);
gameSystem.createUnit(400, 200);
gameSystem.createUnit(500, 200);
gameSystem.createUnit(600, 200);
