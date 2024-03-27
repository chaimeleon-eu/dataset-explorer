import { Container, Navbar, Nav, Badge, Dropdown, NavDropdown } from "react-bootstrap";
import React, { useMemo, useId }from "react";
import { GridFill } from 'react-bootstrap-icons';

import UserInfo from "./UserInfo";
import Config from "../config.json"
import Util from "../Util";

function getReleaseConf() {
  const release = Util.getReleaseType(Config);
  switch (release) {
    case Util.RELEASE_DEV: return {t: "Development", bg: "bg-dark", tc: "text-white"};
    case Util.RELEASE_PROD_TEST: return {t: "Test", bg: "bg-warning", tc: "text-dark"};
    case Util.RELEASE_PROD: return {t: "Production", bg: "bg-transparent", tc: "text-dark"};
    default: console.error(`Unkwnon release type ${release}`);return {t: "", bg: "bg-transparent", tc: ""};
  }

}

function NavbarView() {
  //console.log("navbar");
  const rc = useMemo(() => getReleaseConf(), []);
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
            <Nav.Link title="List of datasets" href={Config.basename + "/datasets"}>Datasets</Nav.Link>
            <NavDropdown title="Documentation" id="documentation-dropdown">
              <NavDropdown.Item title="Dataset Usage Guide" href="https://github.com/chaimeleon-eu/workstation-images/blob/main/ubuntu-python/rootfs/home/chaimeleon/application-examples/dataset-access-guide.ipynb" target="_blank">Dataset Usage</NavDropdown.Item>
              <NavDropdown.Item title="Workstation Usage Guide " href="https://github.com/chaimeleon-eu/workstation-images/blob/main/usage-guide.md" target="_blank">Workstation Usage</NavDropdown.Item>
              <NavDropdown title="Developer" id="developer-dropdown" drop="end" className="w-100 ps-2">
                <NavDropdown.Item title="How to integrate your application in CHAIMELEON platform" href="https://github.com/chaimeleon-eu/workstation-images/blob/main/README.md#how-to-integrate-your-application-in-chaimeleon-platform" target="_blank">App Integration</NavDropdown.Item>
                <NavDropdown.Item title="Dataset Service API Specs" href="https://github.com/chaimeleon-eu/dataset-service#api-usage" target="_blank">API Specs</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown.Divider />
              <NavDropdown.Item title="Fair Principles" href={Config.basename + "/fair"}>Fair Principles</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link title="Support" href={Config.basename + "/support"}>Support</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        {/* keycloak.authenticated ? <Button className="me-1" variant="warning" onClick={() => window.open("https://forms.gle/bDmJC3cHog2CixMB8", '_blank').focus()}>Internal Validation</Button> : <Fragment/> */}
        <Dropdown title="Launch CHAIMELEON Applications" className="float-end me-1" drop="start" >
          <Dropdown.Toggle size="sm" variant="success" id="dropdown-basic">
            <GridFill />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item title="Launch the applications' dashboard (Kubeapps)" onClick={() => window?.open("https://chaimeleon-eu.i3m.upv.es/apps/", '_blank')?.focus()}>
              <img className="apps-logo me-2" src={process.env["PUBLIC_URL"] + "/icons/kubeapps.png"}/>Apps Dashboard
            </Dropdown.Item>
            <Dropdown.Item title="Launch the case explorer (Quibim Precision)" onClick={() => window?.open(Config.caseExplorerService, '_blank')?.focus()}>
              <img className="apps-logo me-2" src={process.env["PUBLIC_URL"] + "/icons/quibim.png"}/>Case Explorer
            </Dropdown.Item>
            <Dropdown.Item title="Access your desktop cluster applications (Apache Guacamole)" onClick={() => window?.open("https://chaimeleon-eu.i3m.upv.es/guacamole/", '_blank')?.focus()}>
              <img className="apps-logo me-2" src={process.env["PUBLIC_URL"] + "/icons/guacamole.png"}/>Desktop Apps Access
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div className="float-end">
          <UserInfo />
        </div>
      </Container>
    </Navbar>);
}

export default NavbarView;
