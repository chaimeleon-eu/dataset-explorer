import { Pagination } from 'react-bootstrap';
import { useCallback } from "react";

const PREVIOUS_PAGE = 0;
const NEXT_PAGE = -1


function PaginationFooter({skip, limit, total, onSkipChange}) {
    const onClickPg = useCallback((pg) => {
        onSkipChange(limit * (pg - 1));
    }, [skip, limit]);

    const onClickPrevious = useCallback(() => {
        onSkipChange(skip - limit);
    }, [skip, limit]);

    const onClickNext = useCallback(() => {
        onSkipChange(skip + limit);
    }, [skip, limit]);

    
    let items = [];
    if (total !== 0  && limit !== 0) {

        const numPages = Math.trunc(total / limit) + (total % limit === 0 ? 0 : 1);
        console.log(total, limit);
        const activePg = 1 + Math.trunc(skip / limit);
        items.push(<Pagination.Prev  onClick={onClickPrevious} disabled={activePg === 1} key={0} />);
        // if (numPages <= 7) {
        //     for (let pg=1; pg<=numPages; ++pg) {
        //         items.push(
        //             <Pagination.Item onClick={() => onClickPg(pg)} key={pg} active={pg === activePg}>
        //             {pg}
        //             </Pagination.Item>
        //         );
        //     }
        // } else {
            items.push(<Pagination.Item onClick={() => onClickPg(1)} key={1} active={1 === activePg}>{1}</Pagination.Item>);
            if (activePg > 4) {
                items.push(<Pagination.Ellipsis  />);
            }
            for (let pg=activePg-2; pg<=activePg+2; ++pg) {
                if (pg > 1 && pg < numPages) {
                    items.push(<Pagination.Item onClick={() => onClickPg(pg)} key={pg} active={pg === activePg}>{pg}</Pagination.Item>);
                }
            }
            if (activePg+3 < numPages) {
                items.push(<Pagination.Ellipsis  />);
            }
            if  (numPages >= 2) {
                items.push(<Pagination.Item onClick={() => onClickPg(numPages)} key={numPages} active={numPages === activePg}>{numPages}</Pagination.Item>);
            }
        //}
        items.push(<Pagination.Next  onClick={onClickNext} disabled={activePg === numPages} key={numPages + 1} />);
    }

    return <Pagination size="sm">{items}</Pagination>;
}

export default PaginationFooter;