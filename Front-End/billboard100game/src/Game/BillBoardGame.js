import { useDispatch, useSelector } from 'react-redux'

import { getSongs } from '../redux/actions/SongsAction'

import '../Welcome.css'
import '../songs-draganddrop.css'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Loading from '../Loading/Loading'

export default function BillBoardGame() {


    const [gameStart, setgameStart] = useState(false)
    const [score, setscore] = useState(0)
    const [questionNum, setquestionNum] = useState(0)
    const [totalQuestions, settotalQuestions] = useState(0)
    const [questionSongs, setquestionSongs] = useState([])
    const [userAnswers, setuserAnswers] = useState([])

    const { songsArray } = useSelector(state => state.SongsReducer)

    const dispatch = useDispatch()

    // calls back end api
    useEffect(async () => {
        dispatch(getSongs())
    }, [])




    // generate 3 songs and assign them to be asked
    const generateQuestionSongs = () => {
        let usedNumbers = []
        let songs = []

        while (usedNumbers.length < 3) {
            // chosen song rank = chosenIndex + 1
            let chosenIndex = Math.floor(Math.random() * 100);
            if (usedNumbers.indexOf(chosenIndex) === -1) {
                songs.push(songsArray[chosenIndex])
                usedNumbers.push(chosenIndex)
            }
        }
        console.log(songs)
        setquestionSongs(songs)
        setuserAnswers(songs)
    }


    // function related to dragable widjet 
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const songs = Array.from(userAnswers);
        const [reorderedAnswer] = songs.splice(result.source.index, 1);
        songs.splice(result.destination.index, 0, reorderedAnswer)

        setuserAnswers(songs)


    }

    // check users answer, give points if neccessary, and setup next question
    const submitAnswer = async () => {


        const correctAnswers = [...questionSongs].sort((song1, song2) => song1.rank - song2.rank);

        let questionScore = 0;
        for (let i = 0; i < userAnswers.length; i++) {
            if (userAnswers[i].name === correctAnswers[i].name) {
                questionScore++
            }

        }
        await setscore(score + questionScore);


        setup()

    }

    //loading screen, credit to https://bootsnipp.com/snippets/dlAQB
    const loading = () => {
        return <Loading />
    }

    // restart the game if user press at the end
    const resetGame = () => {
        setscore(0);
        setgameStart(false);
        console.log(gameStart)
    }


    // main game, has 2 screens -> ending screen (display scores) and game screen (display questions and answer prompt)
    const renderGame = () => {
        if (questionNum > totalQuestions) {
            return <div style={{ height: "100%", width: "100%", position: "absolute" }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5 col-xl-5 mx-auto">
                            <div className="card card-signin flex-row my-5">

                                <div className="card-body">
                                    <div className="card-img-left d-none d-md-flex">
                                    </div>
                                    <h2 className="card-title text-center" style={{ fontWeight: 500, fontSize: 35 }}>Congratulation on finishing, </h2>
                                    <form onSubmit={resetGame}>
                                        <h4>
                                            Your Score is:
                                        </h4>
                                        <h4>
                                            {score} / {totalQuestions * 3}
                                        </h4>

                                        <button type="submit" className="btn btn-success mt-4">Restart!?!</button>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }

        return <div style={{ height: "100%", width: "100%", position: "absolute" }}>

            <header className="App-header text-light">
                <h1>Guess the ranking order (Highest -1- top, Lowest -100- bottom)</h1>

                <h3>Question {questionNum} ( out of {totalQuestions} )</h3>

                <button className="btn btn-success mt-5" onClick={submitAnswer}>Submit Answer</button>

                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="answersOrder">
                        {(provided) => (


                            <ul className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                                {userAnswers.map((song, index) => {
                                    return (
                                        <Draggable key={song.rank} draggableId={song.rank} index={index}>
                                            {(provided) => (
                                                <li {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className="list-group-item mt-4">
                                                    {/* Custom content*/}
                                                    <div className="media align-items-lg-center flex-column flex-lg-row p-3">
                                                        <div className="media-body order-2 order-lg-1">
                                                            <h5 className="mt-0 font-weight-bold mb-2">{song.name}</h5>
                                                            <p className="font-italic text-muted mb-0 small">{song.artist}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            )}
                                        </Draggable>
                                    )

                                })}
                            </ul>
                        )}
                    </Droppable>

                </DragDropContext>
            </header >

        </div >
    }

    // set total number of questions, and start the game
    const startGame = (event) => {
        event.preventDefault();
        let questions = event.target.questionNo.value;
        settotalQuestions(questions)
        setgameStart(true)
        setscore(0);
        setup()

    }

    // preps the next question
    const setup = () => {
        setquestionNum(questionNum + 1)
        generateQuestionSongs();
    }



    const renderWelcome = () => {
        return <div style={{ height: "100%", width: "100%", position: "absolute" }}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-5 col-xl-5 mx-auto">
                        <div className="card card-signin flex-row my-5">

                            <div className="card-body">
                                <div className="card-img-left d-none d-md-flex">
                                </div>
                                <h2 className="card-title text-center" style={{ fontWeight: 500, fontSize: 30 }}>Welcome to guess the order, Billboard 100 Edition!</h2>
                                <form onSubmit={startGame}>
                                    <h4>
                                        Number of Questions?
                                    </h4>
                                    <input type="number" className="form-control mt-4" name="questionNo" required defaultValue={5} min="1" />

                                    <button type="submit" className="btn btn-success mt-4">Start Game!</button>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    }



    return (
        <div>
            {!songsArray.length ? loading() : (gameStart ? renderGame() : renderWelcome())}
        </div>
    )
}
