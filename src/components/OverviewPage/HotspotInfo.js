import React from "react";
import { Image, Button } from "react-bootstrap";

const HotspotInfo = props => {
  return (
    <div>
      <div className="hotspot-header">
        <div>
          <a>{props.hotspotInfo.name}</a>
        </div>
      </div>
      <div className="hotspot-info">
        <div className="hotspot-address">
          {" "}
          {props.hotspotInfo.address.address}
          {","} {props.hotspotInfo.address.postalCode}{" "}
          {props.hotspotInfo.address.city}
          <br></br>
          {props.hotspotInfo.address.country} <br></br>
          <br></br>
          <div className="hotspot-creator-info">
            {/*<Image src={props.hotspotInfo.creator.picture}*/} Created by{" "}
            {props.hotspotInfo.creator.nickname}
          </div>
        </div>
        <div className="hotspot-rating">
          RATING GOES HERE
          <div className="voting-controls">
            <Button className="vote-button" onClick="" variant="">
              +
            </Button>
            <Button className="vote-button" onclick="" variant="">
              -
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotspotInfo;
