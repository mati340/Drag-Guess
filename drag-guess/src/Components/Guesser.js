import GuessDraw from './GuessDraw';

const Guesser = (props) => {

    return (
        <>
            <GuessDraw onWinHandler={props.onWinHandler}></GuessDraw> 
        </>
    );
}

export default Guesser;