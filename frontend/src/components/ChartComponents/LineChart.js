import { Line } from "react-chartjs-2";

const LineChart = ({ chartData }) => {
  return <Line data={chartData} className="bg-black text-white mb-1" />;
};

export default LineChart;
