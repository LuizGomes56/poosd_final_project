import { useEffect } from "react";
import FormBuilder from "../forms/FormBuilder";
import FormCheckbox from "../forms/FormCheckbox";
import FormCheckbox2 from "../forms/FormCheckbox2";
import FormRadiobox from "../forms/FormRadiobox";
import FormSelector from "../forms/FormSelector";
import FormTextInserter from "../forms/FormTextInserter";
import { useNotification } from "../providers/NotificationProvider";

const TestPage = () => {
    const { addNotification } = useNotification();

    useEffect(() => {
        addNotification({ type: "error", });
    }, []);

    return (
        <div>
            <FormBuilder show={true} setShow={() => { }}>
                <FormRadiobox id="testId" value="test" setValue={() => { }} title="test" iterator={{ test: "test", test2: "test" }} />
                <FormCheckbox id="testId" value={true} setValue={() => { }} title="test" label="This is a label" />
                <FormCheckbox2 id="testId" value="test" setValue={() => { }} title="test" iterator={{ test: "test", test2: "test" }} />
                <FormSelector id="testId" value="Testvalue" setValue={() => { }} iterator={{ test: "test", test2: "test" }} />
                <FormTextInserter id="testId" value={["String 1", "string 2"]} setValue={() => { }} title="TEst" />
            </FormBuilder>
        </div>
    )
}

export default TestPage;