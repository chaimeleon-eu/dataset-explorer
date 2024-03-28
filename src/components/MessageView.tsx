import React, {useState, useCallback, useEffect} from 'react';
import {Alert} from "react-bootstrap";

import Message from "../model/Message";

interface MessageViewProps {

  message: Message | null;

}

interface AlertEntryProps {

  message: Message;
  idx: number;
  onAlertClose: Function;
}

function AlertEntry(props: AlertEntryProps): JSX.Element {

  return (
    <Alert variant={props.message.type} onClose={() => props.onAlertClose(props.idx)} dismissible>
      <Alert.Heading>{props.message.title}</Alert.Heading>
      {props.message.message}
    </Alert>
  );
}

const MessageView = (props: MessageViewProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
    const onAlertClose = useCallback((idx: number) => {
      setMessages(oldArray => oldArray.filter((el, i) => i !== idx));
        //console.log(messages);
    }, []);
  //const [messages, setMessages] = useState(null);
  useEffect(() => {
    if (props.message !== null) {
       setMessages((messages: Message[]) => props.message !== null ? [...messages, props.message] : messages);
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
