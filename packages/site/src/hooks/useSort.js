import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";

export default function useSort() {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const sort = searchParams.get("sort");
  const [defaultSortField, defaultSortDirection] = sort ? JSON.parse(sort) : [];
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);
  const history = useHistory();

  useEffect(() => {
    if (sortField && sortDirection) {
      const searchParams = new URLSearchParams(history.location.search);
      searchParams.set("sort", JSON.stringify([sortField, sortDirection]));
      history.push({ search: searchParams.toString() });
    }
  }, [history, sortField, sortDirection]);

  return {
    sortField,
    sortDirection,
    setSortField,
    setSortDirection,
  };
}
