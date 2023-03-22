import React, { useContext, useEffect, useState } from "react";
import Hero from "./hero";
import Sidebar from "./sidebar";
import ArticlesFeed from "./articlesFeed";
import Feed from "./feed";
import Pagination from "./pagination";
import fetchData from "../utils/fetchData";
import ErrorBoundary from "./errorBoundary";
import { userContext } from "./userContext";
import Loading from "./loading";

function Home(props) {
  const [openTag, setOpenTag] = useState("");
  const [articles, setArticles] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [articlesCount, setArticlesCount] = useState(0);
  const [myfeed, setMyfeed] = useState(false);
  const [author, setAuthor] = useState(null);
  const [error, setError] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(
      myfeed === true ? `&author=${author}` : "",
      activeIndex,
      handleArticlesData,
      context.user ? context.user.token : "",
      openTag ? `tag=${openTag}&` : ""
    );
    if (context.user) {
      setAuthor(context.user.username);
    }
  }, [openTag, activeIndex, myfeed]);
  let handleArticlesData = (key, value) => {
    if (key === "articles") {
      setArticles(value);
    }
    if (key === "articlesCount") {
      setArticlesCount(value);
    }
    if (key === "activeIndex") {
      setActiveIndex(value);
    }
    if (key === "author") {
      setAuthor(value);
    }
    if (key === "openTag") {
      setOpenTag(value);
    }
    if (key === "myfeed") {
      setMyfeed(value);
    }
    if (key === "error") {
      setError(value);
    }
  };
  let handleState = (key, value) => {
    setLoading(true);
    setOpenTag("");
    setArticles(null);
    setArticlesCount(0);
    setMyfeed(false);

    if (key === "articles") {
      setArticles(value);
    }
    if (key === "articlesCount") {
      setArticlesCount(value);
    }
    if (key === "activeIndex") {
      setActiveIndex(value);
    }
    if (key === "author") {
      setAuthor(value);
    }
    if (key === "openTag") {
      setOpenTag(value);
    }
    if (key === "myfeed") {
      setMyfeed(value);
    }
    if (key === "error") {
      setError(value);
    }

    setLoading(false);
  };

  let context = useContext(userContext);
  return (
    <div className="main">
      <Hero />
      <div className="flex justify-end">
        <div className="home w-3/5">
          <Feed
            handleState={handleState}
            openTag={openTag}
            author={author}
            myfeed={myfeed}
          />
          {error ? (
            <p className="text-base capitalize text-center m-4">{error}</p>
          ) : loading ? (
            <Loading />
          ) : (
            <>
              <ArticlesFeed
                articles={articles}
                openTag={openTag}
                user={context.user}
                handleState={handleState}
              />
              {articles ? (
                <Pagination
                  handleState={handleState}
                  articlesCount={articlesCount}
                  activeIndex={activeIndex}
                />
              ) : (
                ""
              )}
            </>
          )}
        </div>
        <ErrorBoundary message="Error occured while fetching tags. Please reload the page">
          <Sidebar handleState={handleState} tags={tags} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default Home;
