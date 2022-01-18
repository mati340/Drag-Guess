import Input from "../UI/Input";
import Button from "../UI/Button";
import { useRef, useEffect, useState, useContext } from "react";
import SocketContext from "../Services/Real-Time";

const isEmpty = (value) => {
  return value.trim() === "";
};

const GuessDraw = (props) => {
  const [isStart, setIsStart] = useState(false);
  const [word, setWord] = useState("");
  const guessInputRef = useRef("");
  const drawRef = useRef(null);

  const ServerSocket = useContext(SocketContext);

  const draw = (img) => {
    const ctx = drawRef.current.getContext("2d");

    var imageObj1 = new Image();
    imageObj1.src = img;
    imageObj1.onload = function () {
      drawRef.current.width = 400;
      drawRef.current.height = 400;
      ctx.drawImage(imageObj1, 0, 0);
    };
  };
  useEffect(() => {
    ServerSocket.on("startGuess", (data) => {
      setIsStart(true);
      setWord(data.pickedWord);
      draw(data.draw);
    });

    // CLEAN UP THE EFFECT
    return () => ServerSocket.off("startGuess");
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    const guessIsValid = isEmpty(guessInputRef.current.value);
    if (guessIsValid) {
      console.log("NOT Valid");
      return;
    }

    if (guessInputRef.current.value === word) {
      props.onWinHandler();
    } else {
      alert("wrong! try again");
    }
  };

  return (
    <>
      {!isStart && <h2>Waiting to player to finish drawing</h2>}
      {drawRef && <canvas ref={drawRef}></canvas>}
      {isStart && (
        <form onSubmit={onSubmit}>
          <label htmlFor="guessWord">Guess the word of the draw</label>
          <Input ref={guessInputRef} id="guessWord"></Input>
          <Button type="submit" onClick={onSubmit}>
            Submit
          </Button>
        </form>
      )}
    </>
  );
};

export default GuessDraw;
