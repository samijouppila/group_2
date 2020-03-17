import React, { useState, useEffect } from "react";
import { useBackendAPI } from "../utils/backendAPI"
import MapGL, { Marker,Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import HotspotMarker from "./HotspotMarker";
import HotspotPopup from './HotspotPopup';
import NewHotspotPopup from './NewHotspotPopup';
import SideBar from "./SideBar";
import HotspotCreation from "./HotspotCreation"

const Map = props => {
  const [viewport, setViewPort] = useState({
    width: "100%",
    height: window.innerHeight,
    latitude: 65.013,
    longitude: 25.47,
    zoom: 16
  });

  const { updateHotSpots, hotSpots } = useBackendAPI();

  //createNewHotspot(request);

  useEffect(() => {
    updateViewportFromCoordinates(props.match.params.lat, props.match.params.lng);
  }, [props.match.params.lat, props.match.params.lng]);

  const updateViewportFromCoordinates = (lat, lng) => {
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    if (!(isNaN(lat) || isNaN(lng))) {
      if (lat < 90 && lat > -90) {
        setViewPort({...viewport, latitude: lat, longitude: lng})
      }
    }
  };

  const _onViewportChange = viewport =>
    setViewPort({ ...viewport});

  const [render, setRender] = useState(false);
  const [data, setData] = useState();
  const [markers, setMarkers] = useState();
  const [clickLocation, setClickLocation] = React.useState([]);
  const [selectedMarker, setSelectedMarker] = useState();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const onClickMap = (e) => {
    const [longitude, latitude] = e.lngLat
    console.log(clickLocation.length);
    if(clickLocation.length > 0) {
      setClickLocation([]);
    } 
    else{
      setClickLocation(clickLocation => [...clickLocation, { longitude, latitude }]);
    }
  };
   
  const _onClickMarker = clickedMarker => {
    if (clickedMarker === selectedMarker) {
      //if user clicks same marker again
      setSelectedMarker("");
      setRender(false);
      return;
    }

    setSelectedMarker(clickedMarker);

    if (!render) {
      setRender(true);
    }
  };

  const loadMarkers = () => {
    console.log(data)
    setMarkers(
      data.map(spot => {
        return (
          <Marker
            key={spot.slug}
            latitude={parseFloat(spot.location.latitude)}
            longitude={parseFloat(spot.location.longitude)}
          >
            {render && spot.slug == selectedMarker && (
              <HotspotPopup
                longitude={parseFloat(spot.location.longitude)}
                latitude={parseFloat(spot.location.latitude)}
                name={spot.name}
                description={spot.description}
                slug={spot.slug}
              />
            )}
            <HotspotMarker handler={_onClickMarker} slug={spot.slug} />
          </Marker>
        );
      })
    );
  };

  useEffect(() => {
    updateHotSpots(viewport)
  }, []);

  useEffect(() => {
    setData(hotSpots)
  }, [hotSpots]);

  useEffect(() => {
    if (data) {
      loadMarkers();
    }
  }, [selectedMarker, render, data]);

  return (
    <div className="container-fluid px-0">
      <div className="col-md-2 d-none d-md-block bg-light sidebar-4">
      <SideBar />
      </div>
      <div className="col-md-9 ml-sm-auto col-lg-10 px-0">
        <MapGL
          {...viewport}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          mapStyle="mapbox://styles/t8hosa01/ck6q8al1o1ty61io620yyt0o1"
          onViewportChange={_onViewportChange}
          onClick={() => setRender(false)}
          onClick = {onClickMap}
        >

          <HotspotCreation show={show} onHide={handleClose}></HotspotCreation>

          {clickLocation.map((m, i) => (
              <NewHotspotPopup {...m} key={i} openModal={handleShow}></NewHotspotPopup>
          ))}
          
          {clickLocation.map((m, i) => (
            <Marker {...m} key={i}>
              <HotspotMarker></HotspotMarker>
            </Marker>
          ))}

          {markers}

        </MapGL>
      </div>
      </div>
  );
};

export default Map;
