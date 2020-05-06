import {useState} from 'react';

function useCardHistory(){
    const [history, setHistory] = useState([]);

    const handleHistory = (cardData) => {
        setHistory(prevState => {
            const oldHistoryState = [...prevState];

            //check for duplicates
            for(let i = 0; i < oldHistoryState.length; i++){
                if(JSON.stringify(oldHistoryState[i]) === JSON.stringify(cardData)){
                    oldHistoryState.splice(i,1);
                    break;
                }
            }

            //limit to previous 20 searches
            if (oldHistoryState.length === 20) oldHistoryState.pop();
            return [cardData, ...oldHistoryState];
        });
    };

    return [history, handleHistory];
}

export default useCardHistory;