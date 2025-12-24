import { useEffect, useState } from "react";
import axios from "axios";

type Tag = {
  id: number;
  name: string;
};

const Tags = () => {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3004/tags").then(res => setTags(res.data));
  }, []);

  return (
    <>
      {tags.map(tag => (
        <div key={tag.id} data-testid="tag">
          {tag.name}
        </div>
      ))}
    </>
  );
};

export default Tags;
