import { useCallback, useEffect, useMemo, useRef } from "react";
import { Badge, InputGroup } from "react-bootstrap";

const lblFalse = "Hide datasets flagged with '#flag'";
const lblTrue = "Show only datasets flagged with '#flag'";
const lblMissing = "Show all datasets including those flagged with '#flag'";

function getSearchParamBool(searchParams, param) {
    return searchParams.get(param) === null ? false 
      : (searchParams.get(param).toLowerCase() === "true" ? true : false);
  }
  
// function fillFlagSearchParams(searchParamsOrig) {
//     let searchParams = Object.create(null);
//     // if at least one flag is set to true, set all the undefined ones to false
//     if (searchParamsOrig.get("draft")?.toLowerCase() === "true" 
//         || searchParamsOrig.get("public")?.toLowerCase() === "true" 
//         || searchParamsOrig.get("invalidated")?.toLowerCase() === "true") {
    
//     if (searchParamsOrig.get("draft") === null) {
//         searchParams["draft"] = "false";
//     }
//     if (searchParamsOrig.get("public") === null) {
//         searchParams["public"] = "false";
//     }
//     if (searchParamsOrig.get("invalidated") === null) {
//         searchParams["invalidated"] = false;
//     }
//     } else if (searchParamsOrig.get("draft")?.toLowerCase() === "false"
//         || searchParamsOrig.get("public")?.toLowerCase() === "false"
//         || searchParamsOrig.get("invalidated")?.toLowerCase() === "false") { //Otherwise, remove all flags
//         searchParams["draft"] = null;
//         searchParams["public"] = null;
//         searchParams["invalidated"] = null;
//     }
//     return searchParams;
// }

function getFlagLbl(ref, flagName) {
    if (ref.current) {
        if (ref.current.indeterminate) {
            return lblMissing.replace("#flag", flagName);
        } else {
            if (ref.current.checked) {
                return lblTrue.replace("#flag", flagName);
            } else {
                return lblFalse.replace("#flag", flagName);
            }
        }
    } else {
        return "";
    }
}

function FilterFlags({searchParams, updSearchParams}) {
    const filterFlags = {
      draft: getSearchParamBool(searchParams, "draft"),
      public: getSearchParamBool(searchParams, "public"),
      invalidated: getSearchParamBool(searchParams, "invalidated")
    }
    console.log(filterFlags);


    const draftRef = useRef();
    const publicRef = useRef();
    const invalidatedRef = useRef();
    const lblDraft = getFlagLbl(draftRef, "Draft");
    const lblPublic = getFlagLbl(publicRef, "Public");
    const lblInvalidated = getFlagLbl(invalidatedRef, "Invalidated");

    useEffect(() => {
        draftRef.current.indeterminate = searchParams.get("draft") === null;
      }, [draftRef, searchParams]);

    useEffect(() => {
        publicRef.current.indeterminate = searchParams.get("public") === null;
    }, [publicRef, searchParams]);


    useEffect(() => {
        invalidatedRef.current.indeterminate = searchParams.get("invalidated") === null;
    }, [invalidatedRef, searchParams]);
      

    // useEffect(() => {
    //     const newSearchParams = fillFlagSearchParams(searchParams);
    //     if (Object.keys(newSearchParams).length !== 0) {
    //         updSearchParams(newSearchParams);
    //     }
    //   }, [searchParams, updSearchParams]);

    const updParams = useCallback((e) => {
        //e.preventDefault();
        //console.log(e.target.checked);
        //console.log(e.target.indeterminate);
        let name = e.target.id.split("-").slice(-1);
        switch (searchParams.get(name)) {
            case null: updSearchParams({[name]: "true"}); break;
            case "true": updSearchParams({[name]: "false"}); break;
            case "false": updSearchParams({[name]: null}); break;
            default: console.error(`unhandled case for flags filter with flah ${name} and value ${searchParams.get(name)}`); break;
        }
        // const value = e.target.checked;
        // const indeterminate = e.target.indeterminate;
        // if (value) {
        //     updSearchParams({[name]: "true"});
        // } else {
        //     if (indeterminate) {
        //         updSearchParams({[name]: "true"});                
        //     } else {
        //         updSearchParams({[name]: null});
        //     }

        // }
    }, [searchParams, updSearchParams]);

    return <div className="mt-1 mb-1">
        <h5>Flags</h5>
        <div title={lblDraft}>
            <input type="checkbox" id="filter-draft" name="lblDraft" ref={draftRef}
                checked={filterFlags.draft} onChange={updParams}      
                />
            <Badge className="ms-2 me-2" pill bg="light" text="dark">Draft</Badge> 
        </div>
        <div title={lblPublic}>
            <input type="checkbox" id="filter-public" name="lblPublic"  ref={publicRef}
                checked={filterFlags.public} onChange={updParams} />
            <Badge className="ms-2 me-2" pill bg="dark">Published</Badge> 
        </div>
        <div title={lblInvalidated}>
            <input type="checkbox" id="filter-invalidated" name="lblInvalidated" ref={invalidatedRef} 
                checked={filterFlags.invalidated} onChange={updParams} />
            <Badge className="ms-2 me-2" pill bg="secondary">Invalidated</Badge>
        </div>
    </div>;
}

export default FilterFlags;