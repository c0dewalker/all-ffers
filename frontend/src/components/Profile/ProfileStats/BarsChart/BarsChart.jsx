import React from 'react'
import Chart from 'chart.js'

export default class BarsChart extends React.Component {
constructor(props) {
  super(props)
  this.canvasRef = React.createRef()
  this.chart = undefined
  this.calculateScales = this.calculateScales.bind(this)
}
  componentDidMount() {
    this.drawBars(this.props)
  }

  componentDidUpdate() {
    this.chart.data.datasets[0].data = this.props.startedByMonths
    this.chart.data.datasets[1].data = this.props.finishedByMonths
    this.chart.options.scales.yAxes[0].ticks.max = this.calculateScales().chartMax
    this.chart.options.scales.yAxes[0].ticks.stepSize = this.calculateScales().stepSize
    this.chart.update({ duration: 2000 })
  }

  calculateScales() {
    let chartMax = Math.max(...this.props.startedByMonths,...this.props.finishedByMonths)
    chartMax = chartMax + (5 - chartMax%5)
    let stepSize = (chartMax >= 20) ? 10 : 5
    return { chartMax, stepSize }
  }

  drawBars() {
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'bar',

      // The data for our dataset
      data: {
        labels: this.props.months,
        datasets: [
          {
            label: 'Начато проектов',
            backgroundColor: '#0E53A7',
            borderColor: '#0E53A7',
            data: this.props.startedByMonths,
          },
          {
            label: 'Завершено проектов',
            backgroundColor: '#FF9C00',
            borderColor: '#FF9C00',
            data: this.props.finishedByMonths,
          },
        ]
      },

      // Configuration options go here
      options: {
        title: {
          display: true,
          text: 'Ваши Проекты',
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
      }
    })

  }
  render() {
    return (
      <div className="chart-container" /* style={{'position': 'relative', 'height':'300px', 'width':'300px'}} */>
        <canvas ref={this.canvasRef} id="chart"></canvas>
      </div>
    )
  }
}

