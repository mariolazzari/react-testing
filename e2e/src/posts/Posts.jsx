import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, setError } from "../store/reducers/posts";

const Posts = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.posts.error);
  const posts = useSelector((state) => state.posts.data);
  const isLoading = useSelector((state) => state.posts.isLoading);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);
  return (
    <>
      <h1>Posts Page</h1>
      {isLoading && <div data-testid="loading">Loading</div>}
      {error && <div data-testid="error">{error}</div>}
      {posts.map((post) => (
        <div key={post.id} data-testid="post">
          {post.name}
        </div>
      ))}
      <button
        data-testid="client-error"
        onClick={() => dispatch(setError("Client error"))}
      >
        Trigger client error
      </button>
    </>
  );
};

export default Posts;
