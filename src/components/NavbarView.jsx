import { Container, Navbar, Nav, Badge, Button, DropdownButton, Dropdown } from "react-bootstrap";
import { Navigate, useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect }from "react";
import { GridFill } from 'react-bootstrap-icons';

import UserInfo from "./UserInfo";
import Config from "../config.json"

function NavbarView(props) {

  return(
    <Navbar bg="light" expand="lg" sticky="top">
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Navbar.Brand href={Config.basename + "/"}><b className="m-4">Dataset Explorer</b>
              <span className="app-version">{Config.appVersion}</span></Navbar.Brand>
            <Nav.Link href={Config.basename + "/datasets"}>Datasets</Nav.Link>
            <Nav.Link href={Config.basename + "/fair"}>Fair Principles</Nav.Link>
            <Nav.Link href="https://github.com/chaimeleon-eu/dataset-service#api-usage">API Specs</Nav.Link>
            <Nav.Link href={Config.basename + "/support"}>Support</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Dropdown title="Launch CHAIMELEON Applications" className="float-end me-1" drop="start" >
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            <GridFill />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item title="Launch the applications' dashboard (Kubeapps)" onClick={() => window.open("https://chaimeleon-eu.i3m.upv.es/apps/", '_blank').focus()}>
              <img className="apps-logo me-2" src={Config.basename + "/icons/kubeapps.png"}/>Apps Dashboard
            </Dropdown.Item>
            <Dropdown.Item title="Launch the case explorer (Quibim Precision)" onClick={() => window.open("https://chaimeleon-eu.i3m.upv.es/omni/", '_blank').focus()}>
              <img className="apps-logo me-2" src={Config.basename + "/icons/quibim.png"}/>Case Explorer
            </Dropdown.Item>
            <Dropdown.Item title="Access your desktop cluster applications (Apache Guacamole)" onClick={() => window.open("https://chaimeleon-eu.i3m.upv.es/guacamole/", '_blank').focus()}>
              <img className="apps-logo me-2" src={Config.basename + "/icons/guacamole.png"}/>Desktop Apps Access
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <UserInfo className="float-end"/>
      </Container>
    </Navbar>);
}

export default NavbarView;
