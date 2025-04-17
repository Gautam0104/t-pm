setTimeout(function() {
  document.querySelectorAll(".dropZone").forEach(dropZone => {
    dropZone.addEventListener("dragover", e => {
      e.preventDefault();
      dropZone.style.backgroundColor = "#f5f5f5";
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.style.backgroundColor = "";
    });

    dropZone.addEventListener("drop", e => {
      e.preventDefault();
      dropZone.style.backgroundColor = "";

      const stickerSrc = e.dataTransfer.getData("sticker-src");
      if (!stickerSrc) return;

      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";
      wrapper.style.display = "inline-block";
      wrapper.style.margin = "5px";

      const img = document.createElement("img");
      img.src = stickerSrc;
      img.style.width = "70px";
      img.style.height = "70px";
      img.draggable = true;

      img.addEventListener("dragstart", e => {
        e.dataTransfer.setData("sticker-src", e.target.src);
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "×";
      Object.assign(deleteBtn.style, {
        position: "absolute",
        top: "0",
        right: "0",
        background: "#f44336",
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        cursor: "pointer",
        fontSize: "14px",
        lineHeight: "16px",
        padding: "0",
        display: "none" // hidden by default
      });

      // Show/hide on mouse enter/leave
      wrapper.addEventListener("mouseenter", () => {
        deleteBtn.style.display = "block";
      });

      wrapper.addEventListener("mouseleave", () => {
        deleteBtn.style.display = "none";
      });

      deleteBtn.addEventListener("click", () => {
        wrapper.remove();
      });

      wrapper.appendChild(img);
      wrapper.appendChild(deleteBtn);
      dropZone.appendChild(wrapper);
    });
  });

  document.querySelectorAll("img[draggable='true']").forEach(sticker => {
    sticker.addEventListener("dragstart", e => {
      e.dataTransfer.setData("sticker-src", e.target.src);
    });
  });
}, 10000);
