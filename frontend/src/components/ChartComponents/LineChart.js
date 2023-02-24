import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const LineChart = ({ chartData }) => {
  return <Line data={chartData} className="bg-black text-white mb-1" />;
};

export default LineChart;
