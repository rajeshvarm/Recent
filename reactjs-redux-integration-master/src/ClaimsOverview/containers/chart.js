import React, { Component } from "react";
import PropTypes from "prop-types";
import { Pie } from "react-chartjs-2";

class Chart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;
    const data = [];
    for (let i = 0; i < props.axisKey.length; i++) {
      data.push(parseFloat(props.data[props.axisKey[i]].replace("$", "")));
    }

    const chartData = {
      labels: props.axisLabel,
      datasets: [
        {
          data: data,
          backgroundColor: ["#ef9eea", "#871480"]
        }
      ]
    };

    const chartOptions = {
      title: {
        display: false
      },
      cutoutPercentage: props.cutoutPercentage,
      maintainAspectRatio: false,
      responsive: false,
      legend: {
        display: true,
        position: "bottom",
        labels: {
          usePointStyle: true,
          fontSize: 12,
        }
      }
    };

    return (
      <div className="chart" id="chart">
        <Pie
          data={chartData}
          width={props.width}
          height={props.height}
          options={chartOptions}
        />
      </div>
    );
  }
}

Chart.propTypes = {
  chartData: PropTypes.shape({
    labels: [PropTypes.string],
    datasets: [
      {
        data: [PropTypes.number],
        backgroundColor: [PropTypes.string]
      }
    ]
  }),
  chartOptions: PropTypes.shape({
    cutoutPercentage: PropTypes.number
  }),
  width: PropTypes.number,
  height: PropTypes.number
};

export default Chart;
