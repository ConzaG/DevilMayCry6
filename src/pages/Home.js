import React from "react";
import GameComponent from "../components/GameComponent";

import {config} from '../game/main'

const Home = () => {
  return <div
  style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw', // Occupa l'intera larghezza della finestra
        height: '100vh', // Occupa l'intera altezza della finestra
        overflow: "hidden"
      }}>
    <GameComponent config={config} />
  </div>;
};

export default Home;
