import { useEffect, useState } from "react";
import axios from "axios";

const Tags = () => {
  const [tags, setTags] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3004/tags").then((response) => {
      setTags(response.data);
    });
  }, []);

  return (
    <>
      {tags.map((tag) => (
        <div key={tag.id} data-testid="tag">
          {tag.name}
        </div>
      ))}
    </>
  );
};

export default Tags;
