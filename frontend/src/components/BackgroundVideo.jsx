import React from "react";
import "./BackgroundVideo.css";
import backgroundVideo from "../assets/gradient.mp4"; // Adjust the path as necessary

const BackgroundVideo = () => {
  return (
    <div className="background-video">
      <video autoPlay loop muted>
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default BackgroundVideo;
