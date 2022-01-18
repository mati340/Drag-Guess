import {useState, useEffect} from "react";
import RandomWords from 'random-words';
import Button from '../UI/Button'

const difficulties = ['Easy', 'Medium', 'Hard'];

const PickWord = (props) => {

    const [words,setWords] = useState(null);
    const [difficulty, setDifficulty] = useState(null);
    
    useEffect(() => {
        setWords(RandomWords(3));
    }, []);

    const onPickDifficulty = (event) => {
        event.preventDefault();
        setDifficulty(event.target.innerText);
    }

    const onPickWord = (event) => {
        event.preventDefault();
        props.onPickWordHandler(event.target.innerText, difficulty);
    }

    const onRegenerateWords = (event) => {
        event.preventDefault();
        if(difficulty === 'Easy') setWords(RandomWords(3));
        else if(difficulty === 'Medium') setWords(RandomWords(3));
        else if(difficulty === 'Hard') setWords(RandomWords(3));
        else setWords(RandomWords(3));
    }

    return(
        <div>
            {!difficulty && <h3>Choose a difficulty:</h3>}
            {!difficulty && difficulties.map( difficulty => (<Button key={difficulty} onClick={onPickDifficulty}>{difficulty}</Button>))}

            {difficulty && <h3>Choose a word:</h3>}
            {difficulty && words.map((word) => (<Button key={word} onClick={onPickWord}>{word}</Button>))}
            {difficulty && <br></br>}
            {difficulty && <Button onClick={onRegenerateWords}>New Words</Button>}
        </div>
    );
}

export default PickWord;