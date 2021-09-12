import React, {useState, useEffect} from 'react';
import { MenuItem, FormControl, Select, CardContent, Card } from '@material-ui/core';
import  '../assets/styles/index.css';
import InfoBox  from './InfoBox';
import Table from './Table';
import {sortedData} from '../utilities/utils';
import LineGraph from './LineGraph';
import Map from './Map';
import "leaflet/dist/leaflet.css";

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([34.80746, -40.4796]);
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => setCountryInfo(data));
  }, []);

  useEffect(() => {
    const getCountries = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map(country => ({
          name : country.country,
          value : country.countryInfo.iso2
        }))
        const sortData = sortedData(data);
        setTableData(sortData || []);
        setCountries(countries);
      })      
    }
    getCountries();
  },[])

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    const url = countryCode === 'worldwide' ? 
    'https://disease.sh/v3/covid-19/all' : 
    `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    });
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className = 'app__header'>
          <h2>COVID-19 TRACKER</h2>
          <FormControl className = 'app__dropdown'>
            <Select
              value = {country}
              variant = 'outlined'
              onChange = {onCountryChange}
            >
              <MenuItem value = {'worldwide'}>{'WorldWide'}</MenuItem>
              {
                countries.map((country, index) => {
                  return <MenuItem key = {index} value = {country.value}>{country.name}</MenuItem>
                })
              }
            </Select>          
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox title = {'Coronovirus Cases'} cases = {countryInfo.todayCases} total = {countryInfo.cases}/>
          <InfoBox title = {'Recovered'} cases = {countryInfo.todayRecovered} total = {countryInfo.recovered}/>
          <InfoBox title = {'Deaths'} cases = {countryInfo.todayDeaths} total = {countryInfo.deaths}/>            
        </div>

        <Map
          center = {mapCenter}
          zoom = {mapZoom}
        />

      </div>
      
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries = {tableData}/>
          <h3>Worldwide new cases</h3>
          <LineGraph/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
