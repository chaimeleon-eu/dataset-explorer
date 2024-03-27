import React from "react";

function Footer() {

    return (
        <div className="d-flex justify-content-between w-100 p-1 text-black bg-light bg-gradient mt-4 " style={{"fontSize":"0.75em"}}>
            <span className="ms-2 me-2"><img src={process.env["PUBLIC_URL"] + "/icons/eu.svg"} 
                style={{height:"0.75em"}}/><b className="ms-2">CHAIMELEON Project</b>, DOI <a href="https://doi.org/10.3030/952172">10.3030/952172</a></span>
            <span className="ms-2 me-2">Copyright© <a href="https://www.upv.es/en">UPV</a> 2020-2024 | <a href={process.env["PUBLIC_URL"] + "/terms-and-conditions.pdf"}>Terms & Conditions</a> | <a href={process.env["PUBLIC_URL"] + "/privacy-policy.pdf"}>Privacy Policy</a></span>
            <span className="ms-2 me-2">Powered by <a href="https://reactjs.org/">React</a> & <a href="https://react-bootstrap.github.io/">React Bootstrap</a></span>
        </div>
    );
}

export default Footer;