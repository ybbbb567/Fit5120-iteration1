import React, { useState } from "react";
import { useEffect } from "react";
import Navigationbar from "components/Navigationbar";
import Footer from "components/Footer";
import { getNews } from "api/map";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { Icon } from 'leaflet'

const MapPage = () => {

  const [mapList, setMapList] = useState([]);

  //initial
  useEffect(() => {
    const fetchData = async () => {
      const resultList = await getNews().then((res) => res.result);
      if (resultList) {
        setMapList(resultList);
        console.log(resultList);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    document.title = "Home Page - Trustify Online"
  }, []);

  const popup_text = mapList.map(state => (
    <Popup key={state.stateName}>
      <b>{state.stateName}</b>
      <br />
      Number of Fraud experieced:{state.fraudValue}
      <br />
      <br />
      <b><i>Related News</i></b>
      <br />
      {state.urls.map((link, index) => (
        <React.Fragment key={link.link}>
          {index > 0 && <br />}
          <a href={link.link} target="_blank" rel="noopener noreferrer" >{link.title}</a><br />
        </React.Fragment>
      ))}
      <br></br>
      <b><i>Where you can report the online sacm</i></b>
      <br />
      <a href="https://www.cyber.gov.au/report-and-recover/report">Report Cyber</a>
    </Popup>
  ));

  const circleRadius = mapList.map((state) => state.fraudValue / 10000);

  return (
    <>
      <div className="navbar_color mx-[auto] w-[100%]">
        <Navigationbar
        />
        <div
          className="z-0 font-pacifico h-max	m-max  mx-auto p-[129px] md:px-5 relative w-full">

          <div className="flex item-center w-full md:w-5/12 ml-auto mr-auto px-4">
            <div className="md:pr-12">

              <h3 className="text-3xl font-semibold text-blueGray text-center"> MAP
              </h3>
              <p className="mt-10 text-lg leading-relaxed ">
                The interactive map shows the number of personal fraud experienced in Australia (2021-2022)<br></br> and a List of related news articles if you click the point.
                Where the big red circle is the more personal fraud experienced in that state.
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-10	" style={{ height: '500px', width: '100%' }}>
            <MapContainer center={[-28.2744, 133.7751]} zoom={4} scrollWheelZoom={false} style={{ height: '100%', width: '50%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {mapList.map(state => (
                <Marker
                  key={state.stateName}
                  position={[state.latitude, state.longitude]}
                  icon={new Icon({
                    iconUrl: markerIconPng,
                    iconSize: [25, 41],
                    iconAnchor: [12, 41]
                  })}>
                  {popup_text.find(popup => popup.key === state.stateName)}
                </Marker>
              ))}
              {mapList.map((state, index) => (
                <CircleMarker
                  key={index}
                  center={[state.latitude, state.longitude]}
                  radius={circleRadius[index]}
                  stroke={false}
                  fillOpacity={0.3}
                  fillColor="red"
                />
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
      <Footer
        className="flex flex-col font-spacegrotesk items-center justify-start mt-[171px] w-full"
        feedback="Feedback"
      />
    </>
  );
};

export default MapPage;
