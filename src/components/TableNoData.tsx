import React from "react";

interface TableNoDataProps {
    message?: string | null;
    colSpan: number;
}

function TableNoData({ message, colSpan }: TableNoDataProps) {
    return <tr><td colSpan={colSpan ?? 1}><div className="w-100 text-center">{message ?? "No data available"}</div></td></tr>;
}

export default TableNoData;