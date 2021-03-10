import "./App.css";
import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup, FlyToInterpolator } from "react-map-gl";
import { motion } from "framer-motion";
import { variantMarker, variantContainerMarkers } from "./variants";
import AddNewEntryModal from "./components/addNewEntryModal";
import Search from "./components/search";
import { getEntries } from "./api/api";

function App() {
  const [viewport, setViewport] = useState({
    width: "100vv",
    height: "100vh",
    latitude: -34.61315,
    longitude: -58.43713,
    zoom: 12,
  });
  const [entries, setEntries] = useState([]);
  const [showPopUp, setShowPopUp] = useState({});
  const [openModal, setOpenModal] = useState({
    status: false,
    cords: { latitude: 0, longitude: 0 },
  });

  async function goToEntry(latitude, longitude) {
    setViewport({
      ...viewport,
      longitude,
      latitude,
      zoom: 18,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  }
  
  
  async function listEntries() {
    const logEntries = await getEntries();
    setEntries(logEntries.data);
  }

  async function showAddMarkerPopup(e) {
    let [longitude, latitude] = e.lngLat;
    setOpenModal({ status: true, cords: { latitude, longitude } });
  }

  useEffect(() => {
    listEntries();
  }, []);

  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapStyle="mapbox://styles/bbueri/ckm0w4dpy29ok17s89l5uf4vk"
        onViewportChange={setViewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        onDblClick={showAddMarkerPopup}
      >
        <motion.ul
          variant={variantContainerMarkers}
          initial="hidden"
          animate="visible"
        >
          {entries.map(
            ({
              _id,
              latitude,
              longitude,
             
            }) => (
              <motion.li
                initial="hidden"
                animate="visible"
                variants={variantMarker}
                key={_id}
              >
                <Marker
                  className="custom-marker"
                  latitude={latitude}
                  longitude={longitude}
                >
                  <div onClick={() => setShowPopUp({ [_id]: true })}>
                    <svg
                      style={{
                        height: `1 + (${viewport.zoom} - 8)  * 0.4;`,
                        width: `1 + (${viewport.zoom} - 8)  * 0.4;`,
                        zIndex: "10",
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="marker"
                    >
                      <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 6.243 6.377 6.903 8 16.398 1.623-9.495 8-10.155 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.342-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
                    </svg>
                  </div>
                </Marker>
              </motion.li>
            )
          )}
          {entries.map(
            ({
              _id,
              latitude,
              longitude,
              title,
              description,
              image,
              rating,
            }) => (
              <motion.li
                initial="hidden"
                animate="visible"
                variants={variantMarker}
                key={_id}
              >
               {showPopUp[_id] ? (
                  <motion.div
                    initial={{y:0, opacity:0}}
                    animate={{ y: 0,opacity:1 }}
                    transition={{ ease: "easeOut", duration: .3 }}
                  >
                    <Popup
                      latitude={latitude}
                      longitude={longitude}
                      closeButton={true}
                      closeOnClick={false}
                      onClose={() => setShowPopUp({})}
                      dynamicPosition={true}
                      anchor="top"
                      offsetTop={50}
                      offsetLeft={30}
                      style={{ zIndex: "30" }}
                    >
                      <h2>{title}</h2>
                      <p>{description}</p>
                      <img
                        style={{ maxWidth: "350px", textAlign: "center" }}
                        src={image}
                        alt="marker"
                      ></img>
                      <span>Latitude: {latitude}</span>
                      <span>Longitude: {longitude}</span>
                      <div>
                        Rating: <br></br>
                        {new Array(rating).fill().map((start) => (
                          <span>⭐️</span>
                        ))}
                      </div>
                    </Popup>
                  </motion.div>
                ) : null}
              </motion.li>
            )
          )}
          
        </motion.ul>
      </ReactMapGL>
      <AddNewEntryModal
        listEntries={listEntries}
        setOpenModal={setOpenModal}
        open={openModal}
      />
      <Search goToEntry={goToEntry} />
    </div>
  );
}

export default App;
