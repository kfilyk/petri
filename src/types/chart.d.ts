// Type declarations for Chart.js 2.x
// This is a minimal declaration for the features used in this project

declare module 'chart.js' {
  interface ChartDataset {
    label: string;
    data: (number | null)[];
    borderColor?: string;
    backgroundColor?: string;
    pointRadius?: number;
    lineTension?: number;
    fill?: boolean;
    yAxisID?: string;
  }

  interface ChartData {
    labels?: (string | number)[];
    datasets: ChartDataset[];
  }

  interface ChartScaleOptions {
    id?: string;
    ticks?: {
      maxTicksLimit?: number;
      beginAtZero?: boolean;
    };
    position?: 'left' | 'right' | 'top' | 'bottom';
  }

  interface ChartOptions {
    legend?: {
      display?: boolean;
    };
    animation?: {
      duration?: number;
    };
    scales?: {
      xAxes?: ChartScaleOptions[];
      yAxes?: ChartScaleOptions[];
    };
  }

  interface ChartConfiguration {
    type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'bubble' | 'scatter';
    data: ChartData;
    options?: ChartOptions;
  }

  class Chart {
    constructor(ctx: string | HTMLCanvasElement | CanvasRenderingContext2D, config: ChartConfiguration);
    data: ChartData;
    options: ChartOptions;
    update(): void;
    destroy(): void;
  }

  export = Chart;
}
