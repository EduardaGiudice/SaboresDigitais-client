import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

export const likeAndDislikePost = (postId, usuarioId) =>
  API.put(`/post/likePost/${postId}`, { usuarioId: usuarioId });
