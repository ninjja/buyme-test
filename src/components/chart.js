import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import fetchJsonp from 'fetch-jsonp';
import asyncForEach from '../helpers';
import _ from 'lodash';

export default class Chart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: {},
      accessKey: '78ba762cb652c70befc38f43ba6928dd',
      currencies:  [
        {symbol: 'USD', color: 'blue'},
        {symbol: 'GBP', color: 'yellow'},
        {symbol: 'CAD', color: 'red'},
        //{symbol: 'AUD', color: 'green'},
        //{symbol: 'JPY', color: 'pink'},
      ]
    }
  }

  getRates(date) {
    const symbols = this.state.currencies.map(currency => currency.symbol).join(',');
    return fetchJsonp(`http://data.fixer.io/api/${date}?access_key=${this.state.accessKey}&symbols=${symbols}`, {
      jsonpCallback: 'callback',
      jsonpCallbackFunction: 'search_results',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async componentWillMount() {
    const labels = [];
    const datasets = [];
    const curObj = {};
    const dates = [...new Array(7)].map((i, idx) => moment().startOf("day").subtract(idx, "days").format("YYYY-MM-DD")).reverse();

    await asyncForEach(dates, async date => {
      await this.getRates(date)
      .then(response => response.json())
      .then(json => {
        if (json.success) {
          labels.push(date);
          _.each(Object.keys(json.rates), symbol => {
            if (!_.isArray(curObj[symbol])) curObj[symbol] =[];
            curObj[symbol].push(json.rates[symbol]);
          });
        }
      });
    })

    this.state.currencies.map(currency => datasets.push({
      label: currency.symbol,
      data: curObj[currency.symbol],
      fill: false,
      borderColor: currency.color,
      borderWidth: 2,
    }));

    this.setState({
      chartData: {
        labels,
        datasets,
        options: {
          maintainAspectRatio: false,
        },
      }
    });
  }

  search_results() {}

  render() {
    return (<Line data={this.state.chartData} />);
  }
}
