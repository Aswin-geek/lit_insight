import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useParams } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import axiosInstance from "../../API/axiosInstance";
import { useNavigate } from 'react-router-dom'

const View_Posts = () => {
  const { id } = useParams();
  const [post, setPost] = useState();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [like, setLike] = useState(false);
  const [likes, setLikes] = useState(0);
  const navigate = useNavigate()

  useEffect(() => {
    axiosInstance.get(`view_post/${id}`).then((response) => {
      console.log(response.data);
      setPost(response.data);
    });
    const uid = localStorage.getItem("id");
    const user_id = parseInt(JSON.parse(uid));
    console.log(id, user_id);
    axiosInstance
      .post("like/", { user_id: user_id, review_id: id })
      .then((response) => {
        setLike(response.data.like);
        setLikes(response.data.like_count);
      });
    axiosInstance.get(`comment/${id}/`).then((response) => {
      setComments(response.data);
    });
  }, []);

  async function handleLike(review_id) {
    const id = localStorage.getItem("id");
    const user_id = parseInt(JSON.parse(id));
    try {
      await axiosInstance
        .put("like/", {
          user_id: user_id,
          review_id: review_id,
        })
        .then((response) => {
          setLikes(response.data.like_count);
          console.log(response.data);
          setLike((v) => !v);
        });
    } catch (error) {
      console.log(error);
    }
  }
  function handleComment(review_id) {
    const id = localStorage.getItem("id");
    const user_id = parseInt(JSON.parse(id));
    axiosInstance
      .post("comment/", {
        Description: comment,
        review_id: review_id,
        user_id: user_id,
      })
      .then((response) => {
        setComments([response.data, ...comments]);

        setComment("");
      });
  }
  return (
    <div className="p-2.5 flex flex-col gap-5">
      <span onClick={()=>navigate('/user/view_reviews/')}>
        <ArrowBackIcon />
      </span>
      {post && (
        <>
          <div className="flex flex-col justify-between p-4 leading-normal rounded bg-slate-300 max-h-60 overflow-x-auto">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Book: {post.book_id.Book_Name}
            </h5>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Written By: {post.user_id.username}
            </p>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
              Rating: {post.rating}/5
            </p>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {post.Description}
            </p>
          </div>
          <div className="flex gap-2 bg-slate-300 rounded-full p-1">
            <span
              onClick={() => {
                handleLike(post.id);
              }}
            >
              <ThumbUpIcon className={`${like && "text-blue-500"}`} />
            </span>
            <h3>{likes}</h3>
            <input
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
              type="text"
              id="small-input"
              class="block w-full p-2 text-gray-900 border border-gray-300 rounded-full bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <span onClick={() => handleComment(post.id)}>
              <PlayArrowIcon />
            </span>
          </div>
        </>
      )}

      <div class="flex flex-col justify-between p-1 leading-normal rounded bg-slate-300 max-h-40 overflow-x-auto">
        {comments &&
          comments.map((comment) => {
            return (
              <div>
                <p class="text-xs mb-1 font-normal text-gray-700 dark:text-gray-400 p-1">
                  {comment.user_id.username}
                </p>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 p-1">
                  {comment.Description}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default View_Posts;
