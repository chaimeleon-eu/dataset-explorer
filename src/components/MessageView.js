import {useState, useCallback, useEffect} from 'react';
import React from "react";
import {Alert} from "react-bootstrap";

import Message from "../model/Message.js";

function AlertEntry(props) {

  return (
    <Alert variant={props.message.type} onClose={() => props.onAlertClose(props.idx)} dismissible>
      <Alert.Heading>{props.message.title}</Alert.Heading>
      {props.message.message}
    </Alert>
  );
}

const MessageView = (props) => {
  var [messages, setMessages] = useState([]);
    const onAlertClose = useCallback((idx) => {
      setMessages(oldArray => oldArray.splice(idx, 1));
        console.log(messages);
    }, []);
  //const [messages, setMessages] = useState(null);
  useEffect(() => {
    if (props.message !== null) {
       setMessages([...messages, props.message]);
     }
  }, [props.message]);
    // if (props.message !== null) {
    //   let a = messages.slice();
    //   a.push(props.message);
    //   setMessages(a);
    //   console.log(a);
    // }
  const components = messages.map((m, idx) => <AlertEntry message={m} idx={idx} onAlertClose={onAlertClose} />);
  return (
    <div>
    {components.map((component, index) => (
      <React.Fragment key={index}>
            { component }
      </React.Fragment>
    ))}
    </div>
  );

}

export default MessageView;
