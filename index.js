import { System } from './src/modules/System.js';
import { Field } from './src/modules/Field.js';
import { Timer } from './src/modules/Timer.js';
import { AbstractFactory } from './src/modules/AbstractFactory.js';

const app = document.querySelector('#app');
const gameSystem = Object.create(System);
const gameAbstractFactory = Object.create(AbstractFactory);
const gameTimer = Object.create(Timer);
const gameField = Object.create(Field);

gameTimer.timerInit();
gameTimer.start();
gameAbstractFactory.abstractFactoryInit();
gameSystem.systemInit(gameTimer, gameAbstractFactory);
gameField.fieldInit(app, gameSystem);

gameSystem.createUnit(200, 200, 'Workman');
gameSystem.createUnit(300, 200, 'Workman');
gameSystem.createUnit(400, 200, 'Workman');
gameSystem.createUnit(500, 200, 'Workman');
gameSystem.createUnit(600, 200, 'Workman');
gameSystem.createBuilding(500, 500);

gameSystem.createResource(200, 700);
gameSystem.createResource(300, 700);
gameSystem.createResource(400, 700);
gameSystem.createResource(500, 700);
gameSystem.createResource(600, 700);
