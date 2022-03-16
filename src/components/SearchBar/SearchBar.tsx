import React, { ChangeEvent } from "react";

import "./SearchBar.css";

interface SearchBarProps {
  onSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  query: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, query }) => {
  return (
    <>
      <div className="search-bar">
        <input
          type="search"
          className="search"
          onChange={onSearch}
          value={query}
        />
      </div>
    </>
  );
};

export default SearchBar;
