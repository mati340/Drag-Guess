import Drawer from '../Components/Drawer';
import Guesser from '../Components/Guesser';
import { useState, useEffect, useContext } from "react";
import Button from '../UI/Button';
import SocketContext from '../Services/Real-Time';

const GamePage = () => {

    const [isDrawer, setIsDrawer] = useState(null);
    const [score, setScore] = useState(0);
    const ServerSocket = useContext(SocketContext);

    useEffect( () => {
        ServerSocket.on("startGame", data => {
            if(data === 'drawer'){
                setIsDrawer(true);
            }
            else{
                setIsDrawer(false);
            }
        });
    
        ServerSocket.on("win", data => {
            setIsDrawer((isDraw) => !isDraw);
            setScore(data);
        });

        // CLEAN UP THE EFFECT
        return () => {
            ServerSocket.off('startGame');
            ServerSocket.off('win');
        }
    }, []);

    const onWinHandler = (event) =>{
        ServerSocket.emit('win');
    }
    
    return (
       <div>
        {isDrawer && <Drawer></Drawer>}
        {!isDrawer && <Guesser onWinHandler={onWinHandler}></Guesser>}
        <h2>Your score is: {score}</h2>
       </div> 
    );
}

export default GamePage;