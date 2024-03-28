import { Link, useLocation } from "react-router-dom";
import React, { useEffect } from 'react' ;
import { Breadcrumb } from 'react-bootstrap';
import type BreadcrumbElem from "../model/BreadcrumbElem";

interface BreadcrumbsProps {
      elems: BreadcrumbElem[];
}

function Breadcrumbs(props: BreadcrumbsProps) {
   let location = useLocation();

   useEffect(() => {
         console.log(`You changed the page to: ${location.pathname}`);
   }, [location]);

  return (<Breadcrumb>
    <Breadcrumb.Item key="1" linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
    {props.elems.map((value: BreadcrumbElem, index: number) => {
          return <Breadcrumb.Item key={index + 1} {...(value.active ? {active: true} : {})}
            linkAs={Link} linkProps={{ to: value.link }}>{value.text}</Breadcrumb.Item>;
        })}
  </Breadcrumb>);
}

export default Breadcrumbs;
