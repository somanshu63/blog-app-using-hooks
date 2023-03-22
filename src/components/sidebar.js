import React, { useEffect, useState } from "react";
import baseurl from "../utils/constants";
import Loading from "./loading";

function Sidebar(props) {
  const [tags, setTags] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${baseurl}/api/tags`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        setTags(data.tags);
      })
      .catch((err) => {
        setError("not able to fetch tags");
      });
  }, []);
  if (error) {
    return <p className="text-center p-4">{error}</p>;
  }
  return (
    <div className="w-1/4 bg-pink h-full">
      <h2 className="text-center text-xl capitalize blue p-2">sidebar</h2>
      <div className="tags flex flex-wrap p-2">
        {tags ? (
          tags.map((tag, i) => {
            return <Tag handleState={props.handleState} tag={tag} key={i} />;
          })
        ) : (
          <div className="mx-auto">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
}

function Tag(props) {
  return (
    <a
      onClick={(event) => {
        event.preventDefault();
        props.handleState("openTag", props.tag);
      }}
      className="text-xs tag  py-1 px-2 m-1 border-solid border rounded-md border-blue-900 blue capitalize"
      href="/"
    >
      {props.tag}
    </a>
  );
}

export default Sidebar;
