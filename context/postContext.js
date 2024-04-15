import React, {createContext, useState, useEffect } from "react";
import axios from "axios";

//context

const PostContext = createContext();

const PostProvider = ({ children }) => {
//state
const [posts, setPosts] = useState([]);

//listar posts
const listarTodosPosts = async () => {
  try {
    const {data} = await axios.get('/post/posts')
    setPosts(data?.posts)
  } catch (error) {
    console.log(error);
  }
};

//chamar os posts
useEffect(() => {
    listarTodosPosts()
}, [])


return (
  <PostContext.Provider value={[posts, setPosts, listarTodosPosts]}>
    {children}
  </PostContext.Provider>
);
}

export {PostContext, PostProvider}
