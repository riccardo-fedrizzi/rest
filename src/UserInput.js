import React from 'react';
import ReactDOM from 'react-dom';
import urls from "./urls.json";
import Chart from 'chart.js';

function UserInput() {

    function DisplayData(props) {
        let { data } = props;
        return (
            <div className="container-general">
                <div id="container-latest">
                    <div className="latest" id="container-latest-confirmed">
                        <p>Confirmed</p>
                        <p>{data.latest.confirmed}</p>
                    </div>
                    <div className="latest" id="container-latest-recovered">
                        <p>Recovered</p>
                        <p>{data.latest.recovered}</p>
                    </div>
                    <div className="latest" id="container-latest-deaths">
                        <p>Deaths</p>
                        <p>{data.latest.deaths}</p>
                    </div>
                </div>
                <div id="container-latest-country">
                    <table>
                        <tbody>
                            <tr>
                                <th>Country Name</th>
                                <th>Country Code</th>
                                <th>Confirmed</th>
                                <th>Recovered</th>
                                <th>Deaths</th>
                                <th>Actions</th>
                            </tr>
                            {data.locations.map(item => {
                                return (
                                    <tr key={item.id}>
                                        <th>{item.country}</th>
                                        <th>{item.country_code}</th>
                                        <th>{item.latest.confirmed}</th>
                                        <th>{item.latest.recovered}</th>
                                        <th>{item.latest.deaths}</th>
                                        <th><input id={item.id} className="moreBtn" type="button" value="More" onClick={fetchSpecificCountry}></input></th>
                                    </tr>);
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    function DisplaySpecificCoutryData(props) {
        let data = props.data.location;
        return (
            <div>
                <input type="button" onClick={fetchAllData} id="back-btn" value="Back"></input>
                <p id="country-name">{data.country}</p>
                <div id="container-latest">
                    <div className="latest" id="container-latest-confirmed">
                        <p>Confirmed</p>
                        <p>{data.latest.confirmed}</p>
                    </div>
                    <div className="latest" id="container-latest-recovered">
                        <p>Recovered</p>
                        <p>{data.latest.recovered}</p>
                    </div>
                    <div className="latest" id="container-latest-deaths">
                        <p>Deaths</p>
                        <p>{data.latest.deaths}</p>
                    </div>
                </div>
                <div id="chart-container">
                        <canvas className="chart" id="confirmed-chart" width="600" height="600"></canvas>
                        <canvas className="chart"id="recovered-chart" width="600" height="600"></canvas>
                        <canvas className="chart" id="deaths-chart" width="600" height="600"></canvas>
                </div>
            </div>
        );
    }

    async function fetchAllData(e) {
        e.preventDefault();
        let data = await fetch(urls.v2.locations).then(res => res.json());
        ReactDOM.render(<DisplayData data={data} />, document.getElementById('root'));
    }

    async function fetchSpecificCountry(e) {
        e.preventDefault();

        let charts = ['confirmed-chart', 'recovered-chart', 'deaths-chart'];
        let chartsLabel = ['Confirmed', 'Recovered', 'Deaths'];
        let url = `${urls.v2.locations}${e.target.id}`;
        let data = await fetch(url).then(res => res.json());
        await ReactDOM.render(<DisplaySpecificCoutryData data={data} />, document.getElementById('root'));
        data = data.location.timelines;
        let dataKeys = Object.keys(data);
        dataKeys.forEach((property, i) => {
            let timeline = data[property].timeline;
            let keys = Object.keys(timeline);
            let datas = Object.values(timeline);

            const confirmedChartData = {
                type: 'line',
                data: {
                    labels: keys,
                    datasets: [{
                        label: chartsLabel[i],
                        data: datas,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                }
            };

            new Chart(document.getElementById(charts[i]), confirmedChartData);

        });

    }


    return (

        <div className="main-container">
            <input onClick={fetchAllData} className="button" type="button" value="View last report"></input>
            { /*
            <div>
                <div>
                    <input type="button" value="Advanced Search"></input>
                </div>
                <div>
                    <input type="text" placeholder="Country name"></input>
                    <input type="button" value="Search"></input>
                </div>
            </div>
             */}


            <div id="main-data"></div>
        </div>
    );
}

export default UserInput;
