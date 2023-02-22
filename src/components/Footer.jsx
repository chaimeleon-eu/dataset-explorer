import {Tabs, Tab, Button, Row, Col, Container, Badge, DropdownButton, Dropdown } from "react-bootstrap";
import { Navigate, useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, Fragment }from "react";
import { useKeycloak } from '@react-keycloak/web';
import { EnvelopeFill, ClipboardPlus, PencilFill } from 'react-bootstrap-icons';
import Config from "../config.json";

function Footer(props) {

    return (
        <div className="d-flex justify-content-between w-100 p-1 text-black bg-light bg-gradient mt-4 " style={{"fontSize":"0.75em"}}>
            <span className="ms-2"><img src={Config["basename"] + "/icons/eu.svg"} 
                style={{height:"0.75em"}}/><b className="ms-2">CHAIMELEON Project</b>, DOI <a href="https://doi.org/10.3030/952172">10.3030/952172</a></span>
            <span>Copyright© <a href="https://www.upv.es/en">UPV</a> 2020-2024</span>
            <span className="me-2">Powered by <a href="https://reactjs.org/">React</a> & <a href="https://react-bootstrap.github.io/">React Bootstrap</a></span>
        </div>
    );
}

export default Footer;