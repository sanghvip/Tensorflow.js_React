import './App.css';
import React, {useRef, useEffect, useState} from 'react';

import * as tf from "@tensorflow/tfjs";
import * as qna from "@tensorflow-models/qna";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from "react-loader-spinner";



//handle questions

function App() {

  //configure references and state hooks
const passageRef = useRef(null);
const questionRef = useRef(null);
const [answer, setAnswer] = useState();
const [model, setModel] = useState(null);

//configure tenshorflow model
const loadModel = async () => {
  const loadModel = await qna.load()
  setModel(loadModel);
  console.log('Model loaded');
}

useEffect(()=>{loadModel()},[])

const answerQuestion = async (e) => {
  if (e.which === 13 && model != null){
    console.log('Question submitted')
    const passage = passageRef.current.value
    const question = questionRef.current.value

    const answer = await model.findAnswers(question,passage)
    setAnswer(answer)
    console.log(answer)
  }
}
  return (
    <div className="App">
      <header className="App-header">
        {model == null ?
        <div>
          <div>Model Loading</div>
          <Loader
          type="ThreeDots"
          color='#00BFFF'
          height={100}
          width={100}/>
        </div>
          :
          <React.Fragment>
            passage<textarea ref={passageRef} rows="30" cols="100">
            </textarea>
            Ask a Question
            <input ref={questionRef} onKeyPress={answerQuestion}
            size="80"></input>
            <br/>
            Answers
            {answer ? answer.map((ans, idx) =><div><b>Answer {idx+1} - </b> {ans.text} ({Math.floor(ans.score*100)/100})</div>) : ""}
          </React.Fragment>
        }
      </header>
    </div>
  );
}

export default App;
