const heart = document.querySelector(".ef-heart");
const spiral = document.querySelector(".ef-heart__spiral--fill");
const sparkles = document.querySelector(".ef-heart__sparkles");
heart.addEventListener("click", (e) => {
  spiral.classList.toggle("animate");
  sparkles.classList.toggle("animate");
});