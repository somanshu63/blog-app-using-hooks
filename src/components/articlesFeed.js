import React, { useEffect, useState } from "react";
import { NavLink, withRouter } from "react-router-dom";
import baseurl from "../utils/constants";
import Loading from "./loading";

function ArticlesFeed(props) {
  // state = {
  //   error: "",
  //   user: null,
  // };
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  // componentDidMount() {
  //   if (this.props.user) {
  //     this.setState({
  //       user: this.props.user,
  //       error: this.props.error,
  //     });
  //   }
  // }
  useEffect(() => {
    if (props.user) {
      setUser(props.user);
      setError(props.error);
    }
    if (error !== props.error) {
      setError(props.error);
    }
  }, [props.error]);
  // componentDidUpdate() {
  //   if (this.state.error !== this.props.error) {
  //     this.setState({
  //       error: this.props.error,
  //     });
  //   }
  // }
  let favoriteArticle = (slug, favorited) => {
    if (user) {
      fetch(`${baseurl}/api/articles/${slug}/favorite`, {
        method: favorited ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `${props.user.token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("can't mark as favorite article");
          }
          return res.json();
        })
        .then((article) => {
          props.handleState("myfeed", false);
          if (props.match.params.username) {
            props.handleState("myfeed", props.myfeed);
          }
        })
        .catch((errors) => {
          // this.setState({
          //   error: errors.error,
          // });
          setError(errors.error);
        });
    } else {
      alert("you have to log in first");
    }
  };
  let articles = props.articles;
  return (
    <section className="articles">
      {articles && articles.length < 1 ? (
        <p className="text-center my-4 text-xl capitalize">
          no articles to show
        </p>
      ) : (
        ""
      )}
      {articles && !error ? (
        articles.map((article, i) => {
          return (
            <ArticleFeed
              favoriteArticle={favoriteArticle}
              article={article}
              key={i}
            />
          );
        })
      ) : error ? (
        <p className="text-center my-4 text-xl capitalize">
          no articles to show
        </p>
      ) : (
        <Loading />
      )}
    </section>
  );
}

function ArticleFeed(props) {
  const article = props.article.article;
  return (
    <div className="article justify-between flex p-8 m-4 border-2 border-solid rounded-lg border-blue-900">
      <div className="w-4/5">
        <NavLink to={`/articles/${article.slug}`}>
          <h3 className="text-2xl hover:underline pink">{article.title}</h3>
        </NavLink>
        <NavLink to={`/profiles/${article.author.username}`}>
          <div className="flex hover:underline blue  py-2 items-center">
            <img
              className="h-8 w-8 mr-2 rounded-full"
              src={article.author.image}
              alt={article.author.username}
            ></img>
            <h4 className="blue hover:scale-105">{article.author.username}</h4>
          </div>
        </NavLink>
        <p className="text-l py-2">{article.description}</p>
        <NavLink
          className="text-blue-400 read-more mt-4 inline-block border-2 border-solid rounded-lg py-1 px-2 border-blue-400"
          to={`/articles/${article.slug}`}
        >
          Read More
        </NavLink>
      </div>
      <div>
        <button
          onClick={() => {
            props.favoriteArticle(article.slug, article.favorited);
          }}
          className={`rounded-lg border-solid border-2 favorite ${
            article.favorited ? "border-red-600" : "border-green-600"
          } py-1 px-2`}
        >
          {article.favorited ? `❤️ ` : `💚 `}
          <span
            className={`text-sm ${
              article.favorited ? "text-red-600" : "text-green-600"
            }`}
          >
            {article.favoritesCount}
          </span>
        </button>
      </div>
    </div>
  );
}

export default withRouter(ArticlesFeed);
