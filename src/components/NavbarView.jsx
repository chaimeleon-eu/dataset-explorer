import { Container, Navbar, Nav } from "react-bootstrap";
import { Navigate, useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect }from "react";

import UserInfo from "./UserInfo";

function NavbarView(props) {

  return(
    <Navbar bg="light" expand="lg" sticky="top">
  <Container fluid>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
        <Navbar.Brand href="/">Dataset Explorer</Navbar.Brand>
        <Nav.Link href="/datasets">Datasets</Nav.Link>
        <Nav.Link href="/fair">Fair Principles</Nav.Link>
      </Nav>
    </Navbar.Collapse>
    <UserInfo className="float-end"/>
  </Container>
</Navbar>


  );
}

export default NavbarView;
