function handleCoverImage() {
  const coverImage = document.querySelectorAll(".coverImage");
  const checkBox = document.getElementById("workspaceEditingAdmins");
  console.log(checkBox);
  coverImage.forEach(item => {
    item.classList.toggle("d-none");
  });
}
