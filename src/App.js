import React, {useState,useEffect} from 'react';
import {Card,Typography,CardContent} from '@material-ui/core'
// import 
import "./App.css";
import 'leaflet/dist/leaflet.css'
import {formatStats} from './ult'
import {FormControl, Select,MenuItem} from '@material-ui/core'
import InfoBox from './components/InfoBox';
import Map from './components/Map'
import Table from './components/Table';
import {sortData} from './ult'
import LineGraph from './components/LineGraph'
//imprt compoenets
// import Nav from "./components/nav"
// import Tweets from "./components/tweets"

function App() {
  const [countries,setCountires]=useState([]);
  const [country,setCountry]=useState("worldwide");
  const [countryInfo,setCountryInfo]=useState({});
  const [tableData,setTableData]=useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries,setMapCountries]=useState([]);
  const [casesType,setCasesType]=useState("cases")
  useEffect(()=>{
      const getCountriesData= async()=>{
        await fetch ("https://disease.sh/v3/covid-19/countries")
        .then((response)=>response.json())
        .then((data)=>{
          const countries=data.map((country)=>(
            {
              name:country.country,
              value:country.countryInfo.iso2
            }
          ))
          const sortedData=sortData(data)
          setTableData(sortedData);
          setMapCountries(data)
          setCountires(countries);
          
          console.log("data==>",data);

          // console.log("here",tableData)
          
        });

      };
      getCountriesData();
  },[])
  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response=>response.json())
    .then(data=>{
      setCountryInfo(data);
    })
  },[])
  const onCountryChange= async(event)=>{
    const countyCode=event.target.value;
    console.log(countyCode);
    
    const url=countyCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countyCode}`
    await fetch(url)
    .then(response=> response.json())
    .then(data =>{
      setCountry(countyCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
      setMapZoom(4);
    })
    
  }
  console.log("country nfo",countryInfo)
// https://disease.sh/v3/covid-19/countries
  return (
    <div className="App">
     
     
     {/* header */}
        <div className="app__left">
            <div className="app__header">
     <h1>Covid-19 tracker</h1>
     {/* title anmd select input field */}
    <FormControl className="app__dropdown">
      <Select variant="outlined" onChange={onCountryChange} value={country}>
      <MenuItem value="worldwide">WorldWide</MenuItem>
        {countries.map((country)=>(
          <MenuItem value={country.value}>{country.name}</MenuItem>
        ))}
          {/* <MenuItem value="worldwide">Worldwide</MenuItem>
          <MenuItem value="worldwide">Worldwide</MenuItem>
          <MenuItem value="worldwide">Worldwide</MenuItem>
          <MenuItem value="worldwide">Worldwide</MenuItem>
          <MenuItem value="worldwide">Worldwide</MenuItem>
          <MenuItem value="worldwide">Worldwide</MenuItem>
          <MenuItem value="worldwide">Worldwide</MenuItem> */}
          
      </Select>
    </FormControl>
    </div>
            <div className="app__stats">
            {/* infobox  total cases*/}
            <InfoBox isRed active={casesType === "cases"} onClick={e=> setCasesType('cases')} title="Corona Virus" cases={formatStats(countryInfo.todayCases)} total={formatStats(countryInfo.cases)}></InfoBox>
     
            {/* infobox total recoveries*/}
            <InfoBox active={casesType === "recovered"} onClick={e=> setCasesType('recovered')} title="Recovered" cases={formatStats(countryInfo.todayRecovered)} total={formatStats(countryInfo.recovered)}></InfoBox>
            {/* infobox total deaths*/}
            <InfoBox isRed active={casesType === "deaths"} onClick={e=> setCasesType('deaths')} title="Deaths" cases={formatStats(countryInfo.todayDeaths)} total={formatStats(countryInfo.deaths)}></InfoBox>
    </div>
     

              

              {/* Map */}
              <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}></Map>
     
        </div>
          <Card className="app__right">
            <CardContent>
              {/* table of countries */}
              <h3>Live cases by country</h3>
              <Table countries={tableData}></Table>
              {/* <h1>www</h1> */}
             
              {/* Graph */}
        <h3>WorldWide new {casesType}</h3>
              <LineGraph casesType={casesType}></LineGraph>
            </CardContent>
          </Card>
    </div>
  );
}

export default App;
