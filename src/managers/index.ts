// System and handler exports
export { tileSystem } from './TileSystem';
export { amoebSystem, initAmoebSystemDom } from './AmoebSystem';
export { statSystem, initFoodPopChart, initOptimizationChart, initLifespanChart, resetChartData, resizeCharts } from './StatSystem';
export {
  inputHandler,
  initInputHandlerDom,
  handleMouseEvent,
  handleMouseWheel,
  handleKeyDown,
  handleKeyUp,
  getMouseCoords,
} from './InputHandler';
export { dashboard, initDashboardDom } from './Dashboard';
