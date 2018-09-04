import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import fetchJsonp from 'fetch-jsonp';

export default class Chart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: {},
    }
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }

  getRates(date) {
    return fetchJsonp(`http://data.fixer.io/api/${date}?access_key=78ba762cb652c70befc38f43ba6928dd&symbols=USD,GBP,CAD`, {
      jsonpCallback: 'callback',
      jsonpCallbackFunction: 'search_results',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async componentWillMount() {
    const cadData = [];
    const usdData = [];
    const gbpData = [];
    const labels = [];
    const dates = [...new Array(7)].map((i, idx) => moment().startOf("day").subtract(idx, "days").format("YYYY-MM-DD"));

    await this.asyncForEach(dates, async date => {
      await this.getRates(date)
      .then(response => response.json())
      .then(json => {
        if (json.success) {
          labels.push(date);
          cadData.push(json.rates.CAD);
          usdData.push(json.rates.USD);
          gbpData.push(json.rates.GBP);
        }
      });
    })
    this.setState({
      chartData: {
        labels,
        options: {
                    maintainAspectRatio: false,
                },

        datasets: [{
            label: 'USD',
            data: usdData,
            fill: false,
            borderColor: 'pink',
            borderWidth: 2
        },
        {
            label: 'CAD',
            data: cadData,
            fill: false,
            borderColor: 'blue',
            borderWidth: 2
        },
        {
            label: 'GBP',
            data: gbpData,
            fill: false,
            borderColor: 'yellow',
            borderWidth: 2
        }],
      } 
    });
  }

  search_results() {}

  render() {
    return (<Line data={this.state.chartData} />);
  }
}
