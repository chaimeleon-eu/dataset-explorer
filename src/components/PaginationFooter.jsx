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
        const activePg = 1 + Math.trunc(skip / limit);
        items.push(<Pagination.Prev  onClick={onClickPrevious} disabled={activePg === 1} key={0} />);
        for (let pg=1; pg<=numPages; ++pg) {
            items.push(
                <Pagination.Item onClick={() => onClickPg(pg)} key={pg} active={pg === activePg}>
                {pg}
                </Pagination.Item>
            );
        }
        items.push(<Pagination.Next  onClick={onClickNext} disabled={activePg === numPages} key={numPages + 1} />);
    }

    return <Pagination size="sm">{items}</Pagination>;
}

export default PaginationFooter;