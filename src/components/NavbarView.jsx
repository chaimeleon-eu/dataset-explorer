import { Container, Navbar, Nav, Badge } from "react-bootstrap";
import { Navigate, useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect }from "react";

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
          </Nav>
        </Navbar.Collapse>
        <UserInfo className="float-end"/>
      </Container>
    </Navbar>);
}

export default NavbarView;
