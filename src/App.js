import { useEffect, useState } from "react";
import "./App.css";
import SearchIcon from "./search.svg";

const API_URL = "http://www.omdbapi.com/?apikey=86916ada";
const App = () => {
  //input state
  const [movieInput, setMovieInput] = useState("super");
  //results
  const [results, setResults] = useState([]);

  //page numbers
  const [pages, setPages] = useState(0);

  //FUNCTIONS
  //Search DB for given title
  const searchMovies = async (title, page) => {
    const response = await fetch(`${API_URL}&s=${title}&page=${page}`);
    const data = await response.json();

    if (data.Response === "True") {
      setResults(data.Search);
      setPages(Math.round(data.totalResults / 10));
      //   console.log(pages);
    } else {
      console.log(data);
    }
  };
  //triggers searchMovies
  useEffect(() => {
    searchMovies(movieInput, 1);
  }, []);
  return (
    <div className="app">
      <h1>
        <span>Film</span> Junction
      </h1>
      <SearchBar
        movieInput={movieInput}
        setMovieInput={setMovieInput}
        searchMovies={searchMovies}
      />
      <div className="movie_grid">
        {results.length !== 0 ? (
          results.map((movie) => {
            return <Movie key={movie.imdbID} movie={movie} />;
          })
        ) : (
          <div>No results found</div>
        )}
      </div>
      <nav>
        <Pages
          pages={pages}
          movieInput={movieInput}
          searchMovies={searchMovies}
        />
      </nav>
    </div>
  );
};

function Pages({ pages, movieInput, searchMovies }) {
  const pageLinks = [];
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    searchMovies(movieInput, currentPage);
  }, [currentPage]);

  pageLinks.push(
    <button
      key="0"
      onClick={() => {
        setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage);
      }}
    >
      &#8592;
    </button>
  );
  for (let i = 1; i < pages && i < 4; i++) {
    pageLinks.push(
      <li
        key={i + 1}
        value={i}
        onClick={(e) => {
          setCurrentPage(e.target.value);
        }}
      >
        {i}
      </li>
    );
  }
  pageLinks.push(<li key={pages + 1}>...</li>);
  pageLinks.push(
    <li
      key={pages + 2}
      value={pages}
      onClick={(e) => {
        setCurrentPage(e.target.value);
      }}
    >
      {pages}
    </li>
  );
  pageLinks.push(
    <button
      key={pages + 3}
      onClick={() => {
        setCurrentPage(currentPage < pages ? currentPage + 1 : currentPage);
      }}
    >
      &#8594;
    </button>
  );
  return <ul className="links">{pageLinks}</ul>;
}

function Movie({ movie, id }) {
  return (
    <div key={id} className="movie">
      <img
        src={
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/400"
        }
        alt={movie.Title + " poster"}
      />
      <h3>{movie.Title}</h3>
    </div>
  );
}

function SearchBar({ movieInput, setMovieInput, searchMovies }) {
  return (
    <div className="search">
      <input
        placeholder="Search for movies"
        value={movieInput}
        onChange={(e) => {
          setMovieInput(e.target.value);
        }}
      />
      <img
        src={SearchIcon}
        alt="search"
        onClick={() => {
          searchMovies(movieInput, 1);
        }}
      />
    </div>
  );
}

export default App;
