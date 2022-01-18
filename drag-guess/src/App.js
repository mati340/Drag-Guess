import "./App.css";
import GamePage from "./Pages/GamePage";
import WelcomePage from "./Pages/WelcomePage";
import WaitingPage from "./Pages/WaitingPage";
import { useState, useEffect, useContext } from "react";
import SocketContext from "./Services/Real-Time";

function App() {
  const [isPlay, setIsPlay] = useState(false);
  const [isWait, setIsWait] = useState(false);
  const ServerSocket = useContext(SocketContext);

  useEffect(() => {
    ServerSocket.on("playStatus", (data) => {
      if (data === "wait") {
        setIsWait(true);
        setIsPlay(false);
      }
      if (data === "play") {
        setIsPlay(true);
        setIsWait(false);
      }

    });
    return () => {
      ServerSocket.off('playStatus');
    }
  }, []);

  const onStartGame = () => {
    ServerSocket.emit("startPlay");
  };

  return (
    <>
      {!isPlay && !isWait && (
        <WelcomePage onStartGame={onStartGame}></WelcomePage>
      )}
      {isWait && <WaitingPage></WaitingPage>}
      {isPlay && <GamePage></GamePage>}
    </>
  );
}

export default App;
