import React, { useState, useEffect, useRef } from 'react';
import useGeolocation from 'react-hook-geolocation';
import { MapContainer, TileLayer, Marker, Popup, Rectangle, useMap } from 'react-leaflet';
import L from 'leaflet';

import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  myMap: {
    minHeight: 400,
    height: '100vh'
  }
});

// [ child ] taxis markers
const Taxis = ({ taxiGeo, getTaxi, count, taxiList, setTaxiList, setTaxiBound, initInterval }) => {
  const retrigger = useRef({ getTaxi, count });
  
  const TaxiMarker = new L.icon({
    iconUrl: require('../img/taxi2.svg').default,
    iconSize: [50, 50],
    iconAnchor: [20, 50],
  });


  const getTaxis = async (newCount, newGetTaxi=false) => {
    const toFetch = {
      lat: taxiGeo[0],
      lon: taxiGeo[1],
      count: newCount
    };

    let lats = [taxiGeo[0]];
    let lons = [taxiGeo[1]];
    console.log('GETTAXI', newGetTaxi);
    if (newGetTaxi) {
      await fetch("http://localhost:3000/taxis", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(toFetch)
      })
        .then(res => res.json())
        .then(response => {
          setTaxiList(response);

          // get all lats & lons
          response.drivers.map(driver => {
            lats.push(driver.location.latitude);
            lons.push(driver.location.longitude);
          });

          // get min & max
          let minLat = Math.min.apply(null, lats),
            maxLat = Math.max.apply(null, lats);
          let minLon = Math.min.apply(null, lons),
            maxLon = Math.max.apply(null, lons);

          setTaxiBound([[minLat, minLon], [maxLat, maxLon]]);
        });
    }
  }

  let intervalWindow = (ref, intCount, intTaxi) => {
    // initInterval[ref] = window.setInterval(() => {
    //     getTaxis(intCount, intTaxi);
    //   }, 10000);
  }

  useEffect(async () => {
    
    if(retrigger.current.getTaxi !== getTaxi){
      retrigger.current.getTaxi = getTaxi;
      getTaxi && getTaxis(retrigger.current.count, getTaxi);
      intervalWindow('initTaxi', retrigger.current.count, getTaxi);
      if(!getTaxi){
        clearInterval(initInterval.initCount);
        clearInterval(initInterval.initTaxi)
      }
      clearInterval(initInterval.initCount);
    }

    if(retrigger.current.count !== count && retrigger.current.getTaxi){
      retrigger.current.count = count
      getTaxis(count, retrigger.current.getTaxi);
      intervalWindow('initCount', count, retrigger.current.getTaxi);
      clearInterval(initInterval.initTaxi);
    }

    console.log('initInterval', initInterval);

  }, [getTaxi, count]);

  return taxiList.drivers.map((taxi, i) => {
    const { latitude, longitude } = taxi.location;

    return (
      <Marker key={i} position={[latitude, longitude]} icon={TaxiMarker} />
    )
  });

}

// [ child ] create bound
const Boundary = ({ officeGeo, userGeo, getTaxi, taxiBound, officesList, selectedBranch }) => {
  const map = useMap();
  const bounds = [userGeo, officeGeo];
  const officeDetails = officesList[selectedBranch];
  const SplytMarker = new L.icon({
    iconUrl: require('../img/splyti.svg').default,
    iconAnchor: [20, 50],
    iconSize: [50, 50],
    popupAnchor: [0, -30],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
  });

  useEffect(() => {
    map.fitBounds(bounds);
  }, [officeGeo]);

  useEffect(() => {
    if (getTaxi) {
      taxiBound.length > 0 && map.fitBounds(taxiBound)
    } else {
      map.fitBounds(bounds);
    }

  }, [getTaxi, taxiBound]);

  return (
    <>
      <Marker position={userGeo}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <Marker position={officeGeo} icon={SplytMarker}>
        <Popup>
          <p>SPLYT {officeDetails.branch}<br />{officeDetails.address}</p>
        </Popup>
      </Marker>
      <Rectangle bounds={[userGeo, officeGeo]} pathOptions={{ color: 'transparent' }} />
    </>
  )
}

// default component
const MapScreen = ({ officesList, selectedBranch, setBranch, getTaxi, setGetTaxi, count, taxiAt }) => {
  const classes = useStyles();
  const geolocation = useGeolocation();

  const [officeGeo, setOfficeGeo] = useState([]);
  const [userGeo, setUserGeo] = useState([]);
  const [taxiList, setTaxiList] = useState({ drivers: [] });
  const [taxiBound, setTaxiBound] = useState([]);

  let initInterval = {};

  // get closest office
  const closestOffice = () => {
    let origin = 0;
    let closestRange = 0;
    let closestBranch = '';
    // run only user coordinate collected
    if (userGeo.length === 2 && userGeo[1]) {
      origin = userGeo[0] ^ 2 + userGeo[1] ^ 2;
      Object.keys(officesList).map(office => {
        const [lat, lon] = officesList[office].coordinate;
        const square = lat ^ 2 + lon ^ 2;
        if (origin - square < closestRange) {
          closestRange = origin - square;
          closestBranch = office;
        }
      });
      // replace default value
      setBranch(closestBranch);
    }
  }

  useEffect(() => {
    setUserGeo([geolocation.latitude, geolocation.longitude]);
    closestOffice();
  }, [geolocation]);

  useEffect(() => {
    setOfficeGeo(officesList[selectedBranch].coordinate);
    setGetTaxi(false);
    setTaxiList({ drivers: [] });
  }, [selectedBranch]);

  useEffect(() => {
    !getTaxi && setTaxiList({ drivers: [] });
  }, [getTaxi]);


  return (
    <>
      {
        !geolocation.error && userGeo.length === 2 && userGeo[1] !== null && officeGeo.length === 2
          ? (
            <MapContainer className={classes.myMap} center={userGeo} zoom={13} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Boundary {...{ geolocation, userGeo, officeGeo, getTaxi, taxiBound, officesList, selectedBranch }} />
              <Taxis taxiGeo={taxiAt === 'office' ? officeGeo : userGeo} {...{ getTaxi, count, taxiList, setTaxiList, setTaxiBound, initInterval}} />
            </MapContainer>
          )
          : (
            <p>No geolocation, sorry.</p>
          )
      }
    </>
  )
}
export default MapScreen;