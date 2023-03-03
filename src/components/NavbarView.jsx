import { Container, Navbar, Nav, Badge, Button, DropdownButton, Dropdown } from "react-bootstrap";
import { Navigate, useParams, useNavigate, useLocation } from "react-router-dom";
import { useMemo, useId }from "react";
import { GridFill } from 'react-bootstrap-icons';

import UserInfo from "./UserInfo";
import Config from "../config.json"
import Util from "../Util.js";

function getReleaseConf() {
  const release = Util.getReleaseType(Config);
  switch (release) {
    case Util.RELEASE_DEV: return {t: "Development", bg: "bg-dark", tc: "text-white"};
    case Util.RELEASE_PROD_TEST: return {t: "Test", bg: "bg-warning", tc: "text-dark"};
    case Util.RELEASE_PROD: return {t: "Production", bg: "bg-transparent", tc: "text-dark"};
    default: console.error(`Unkwnon release type ${release}`);return {t: "", bg: "bg-transparent", tc: ""};
  }

}

function NavbarView(props) {
  console.log("navbar");
  const rc = useMemo(() => getReleaseConf());
  const nbCollapseId = useId();
  return(
    <Navbar bg="light" expand="lg" sticky="top">
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id={nbCollapseId}>
          <Nav className="me-auto">
            <Navbar.Brand className={`p-1 ${rc.bg} ${rc.tc}`} href={Config.basename + "/"}>
              <div className="d-flex flex-row">
                <b className="fs-4">Dataset Explorer</b>
                <div className="d-flex flex-column ms-2">
                  <Badge style={{"fontSize": "50%"}} className={`p-1 ${rc.bg} ${rc.tc}`}>{rc.t}</Badge>
                  <span className="app-version ms-1">{Config.appVersion}</span>
                </div>
                </div>
            </Navbar.Brand>
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
