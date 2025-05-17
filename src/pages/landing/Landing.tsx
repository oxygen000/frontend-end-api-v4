import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

function Landing() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.volume = 1;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Playback started with sound");
          })
          .catch((error) => {
            console.warn("Autoplay with sound failed:", error);
            video.muted = true;
            video.play(); // fallback muted
          });
      }
    }
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-fill object-center"
      >
        <source src="/landing/hero2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="relative z-10 w-full h-full">
        <Link to="/login">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.2,
              ease: "easeInOut",
            }}
            className="absolute top-[77%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold py-3 px-6 rounded-lg shadow-lg"
          >
            Get Started
          </motion.button>
        </Link>
      </div>
    </div>
  );
}

export default Landing;
