import "./styles/style.css";

import { Game } from "./core/Game";

const canvasId = "gameCanvas";
const game = new Game(canvasId);
game.start();
