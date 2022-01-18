import Canvas from './Canvas';
import PickWord from './PickWord';
import Button from '../UI/Button';
import {useState, useContext, useRef} from 'react';
import SocketContext from "../Services/Real-Time";

const Drawer = () => {

    const [isPickedWord, setIsPickedWord] = useState(false);
    const [pickedWord, setPickedWord] = useState(null);
    const [pickedDifficulty, setPickedDifficulty] = useState(null);
    const imgRef = useRef(null);
    const ServerSocket = useContext(SocketContext);

    const onSubmitHandler = (event) => {
        event.preventDefault();
        //send to guesser the drawing
        ServerSocket.emit('drawSubmit', {pickedWord: pickedWord, pickedDifficulty: pickedDifficulty, draw: imgRef.current});
        alert('Now we wait');
    }

    const onPickWordHandler = (word, difficulty) => {
        setIsPickedWord(true);
        setPickedWord(word);
        setPickedDifficulty(difficulty);
    }

    return (
        <>
            {!isPickedWord && <PickWord onPickWordHandler={onPickWordHandler}></PickWord>}
            {isPickedWord && <Canvas ref={imgRef}></Canvas>}
            {isPickedWord && <h2>Draw the word: {pickedWord}</h2>}
            {isPickedWord && <Button onClick={onSubmitHandler}>Submit</Button>}
        </>
    );
}

export default Drawer;