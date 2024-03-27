import React from "react";
import {  Container } from 'react-bootstrap';

function SupportView() {
    return (
        <Container>
            <div className="alert alert-info" role="alert">
                Please use the link bellow to report bugs or request new functionality for any service, component, application etc. on the CHAIMELEON platform (by creating an issue).  
                You will be redirected to Github to the list of already existing issue. 
                Before anything, please check this list, the problem you have encountered on our platform might have been reported already.  
                If you find an existing issue that matches your own, feel free to join the discussion, we are happy to assist you. 
                Otherwise, please use the <b>New issue</b> green button to open a new one. 
                Do not forget to include as much information as possible, but take into account that <b>ALL</b> the information you post is publicly available for anyone on the Internet to see.
                <br></br>
                <b><i>Do not include any private, personal, or any other type of information that should not be shared with the whole planet!</i></b>
            </div>
            <p>
                <a href="https://github.com/chaimeleon-eu/CHAIMELEON-Platform/issues"><b>Report bug/Request new functionality</b></a>
            </p>
        </Container>
    );
}
export default SupportView;