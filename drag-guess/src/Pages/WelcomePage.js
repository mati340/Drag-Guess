import Button from '../UI/Button'
import SocketContext from "../Services/Real-Time";
import {useState, useEffect, useContext } from "react";

const WelcomePage = (props) => {

  const ServerSocket = useContext(SocketContext);
  const [bestScore, setBestScore] = useState(null);

  useEffect( () => {
    ServerSocket.on("bestScore", data => {
        setBestScore(data);
    });

    // CLEAN UP THE EFFECT
    return () => {
        ServerSocket.off('bestScore');
    }
}, []);
    return (
      <>
        <h1>Welcome To Draw & Guess Game!</h1>
        {bestScore !== null && <h1>Best score is: {bestScore}</h1>}
        <Button onClick={props.onStartGame}>Start Game</Button>
      </>
    );
}

export default WelcomePage;