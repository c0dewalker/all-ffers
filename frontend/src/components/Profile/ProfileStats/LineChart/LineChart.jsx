import React from 'react'
import Chart from 'chart.js'

export default class BarsChart extends React.Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
    this.calculateScales = this.calculateScales.bind(this)
    this.chart = undefined
  }

  componentDidMount() {
    this.drawBars(this.props)
  }

  componentDidUpdate() {
    this.chart.data.datasets[0].data = this.props.earnedByMonths
    this.chart.options.scales.yAxes[0].ticks.max = this.calculateScales().chartMax
    this.chart.options.scales.yAxes[0].ticks.stepSize = this.calculateScales().stepSize
    this.chart.update({ duration: 2000 })
  }

  calculateScales() {
    let chartMax = Math.max(...this.props.earnedByMonths)
    chartMax = chartMax + (50000 - chartMax%50000)
    let stepSize = (chartMax >= 150000) ? 50000 : 25000
    return { chartMax, stepSize }
  }

  drawBars() {
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: {
        labels: this.props.months,
        datasets: [
          {
            label: 'Заработано за месяц',
            borderColor: '#0E53A7',
            data: this.props.earnedByMonths,
          },
        ]
      },

      // Configuration options go here
      options: {
        title: {
          display: true,
          text: 'Ваши Доходы',
          fontSize: 15,
        },
        legend: {
          position: 'bottom',
        },
        scales: {
          yAxes: [{
            scaleStartValue: 0,
            ticks: {
              max: this.calculateScales().chartMax,
              min: 0,
              stepSize: this.calculateScales().stepSize,
            },
          }],
        },
      },
    })

  }
  render() {
    return (
      <div className="chart-container">
        <canvas ref={this.canvasRef} id="chart"></canvas>
      </div>
    )
  }
}
