import { useState } from "react";
import { Field } from "./Form";
import FormBuilder from "../forms/FormBuilder";
import FormTextField from "../forms/FormTextField";

function questionCrudOperations(id: any) {
    return {id: id, question: "Who are you?", answers: [{id: 0, answer: "testing one answer"}, {id: 1, answer: "testing two answers"}, {id: 2, answer: "testing three answers"}, {id: 3, answer: "testing four answers"}]
    }
}
export default function QuestionEditPage(id: string, hidden: boolean, setHidden: any) {
    let questionAttributes = questionCrudOperations(id);
    const [question, setQuestion] = useState(questionAttributes.question);
    const [answers, setAnswers] = useState(questionAttributes.answers);
    console.log("Rendering Question Edit Page")
    return (
        <div className="">
            <FormBuilder
            show={hidden}
            setShow={setHidden}>
                <FormTextField id="Question" value={question} setValue={setQuestion} title="Question"/>

            </FormBuilder>

            
            {/* <Field name="Question" value={question} hook={setQuestion} textStyle="text-white" spanStyle="font-medium text-white text-lg border-b-2 pb-1 border-b-white"/>
            {answers.map((answer) => (
                <Field name="Answer" value={answer.answer} hook={(newValue) => { 
                    let localAnswers = structuredClone(answers);
                    localAnswers[answer.id].answer = newValue;
                    setAnswers(localAnswers);
                }} textStyle="text-white" spanStyle="font-medium text-white text-lg border-b-2 pb-1 border-b-white"/>
            ))} */}
        </div>
    )
}