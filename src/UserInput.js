import { func } from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import urls from "./urls.json";

function UserInput() {

    function DisplayData(props) {
        let { data } = props;
        return (
            <div>
                <div id="container-latest">
                    <div id="container-latest-confirmed">
                        <p>Confirmed</p>
                        <p>{data.latest.confirmed}</p>
                    </div>
                    <div id="container-latest-recovered">
                        <p>Recovered</p>
                        <p>{data.latest.recovered}</p>
                    </div>
                    <div id="container-latest-deaths">
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
                                        <th><input id={item.id} type="button" value="More" onClick={fetchSpecificCountry}></input></th>
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
                <p>{data.country}</p>
                <div id="container-latest">
                    <div id="container-latest-confirmed">
                        <p>Confirmed</p>
                        <p>{data.latest.confirmed}</p>
                    </div>
                    <div id="container-latest-recovered">
                        <p>Recovered</p>
                        <p>{data.latest.recovered}</p>
                    </div>
                    <div id="container-latest-deaths">
                        <p>Deaths</p>
                        <p>{data.latest.deaths}</p>
                    </div>
                </div>
                <div id="map-container">
                    <div>
                        <p>Confirmed</p>
                        <canvas id="confirmed-chart" width="600" height="600"></canvas>
                    </div>
                    <div>
                        <p>Recovered</p>
                        <canvas id="recovered-chart" width="600" height="600"></canvas>
                    </div>
                    <div>
                        <p>Deaths</p>
                        <canvas id="deaths-chart" width="600" height="600"></canvas>
                    </div>
                </div>
            </div>
        );
    }

    async function fetchAllData(e) {
        e.preventDefault();
        let data = await fetch(urls.v2.locations).then(res => res.json());
        ReactDOM.render(<DisplayData data={data} />, document.getElementById('main-data'));
    }

    async function fetchSpecificCountry(e) {
        e.preventDefault();
        let url = `${urls.v2.locations}${e.target.id}`;
        let data = await fetch(url).then(res => res.json());
        await ReactDOM.render(<DisplaySpecificCoutryData data={data} />, document.getElementById('main-data'));
        let confirmedData = data.location.timelines.confirmed.timeline;
        let confirmedDataKeys = Object.keys(confirmedData);
        confirmedData = Object.values(confirmedData);

        const confirmedChartData = {
            type: 'line',
            data: {
                labels: confirmedDataKeys,
                datasets: [{
                    label: 'Cases',
                    data: confirmedData,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
        };
        new Chart(document.getElementById('confirmed-chart'), confirmedChartData);
    }


    return (

        <div className="App">
            <input onClick={fetchAllData} type="button" value="View last report"></input>
            <div>
                <div>
                    <input type="button" value="Advanced Search"></input>
                </div>
                <div>
                    <input type="text" placeholder="Country name"></input>
                    <input type="button" value="Search"></input>
                </div>
            </div>
            <div id="main-data"></div>
        </div>
    );
}

export default UserInput;
