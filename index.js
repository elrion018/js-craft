import { System } from './src/modules/System.js';
import { Field } from './src/modules/Field.js';
import { Timer } from './src/modules/Timer.js';

const app = document.querySelector('#app');
const gameSystem = Object.create(System);
const gameTimer = Object.create(Timer);
const gameField = Object.create(Field);

gameTimer.timerInit();
gameTimer.start();
gameSystem.systemInit(gameTimer);
gameField.fieldInit(app, gameSystem);

gameSystem.createUnit(200, 200);
gameSystem.createUnit(300, 200);
gameSystem.createUnit(400, 200);
gameSystem.createUnit(500, 200);
gameSystem.createUnit(600, 200);
gameSystem.createBuilding(500, 500);

gameSystem.createResource(200, 700);
gameSystem.createResource(300, 700);
gameSystem.createResource(400, 700);
gameSystem.createResource(500, 700);
gameSystem.createResource(600, 700);
