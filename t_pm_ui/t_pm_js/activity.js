//fetch all comments
const activitycommentTab = document.getElementById("all-activity-tab");

console.log("activitycommentTab", activitycommentTab);

fetch(`${API_BASE_URL}${API_ROUTES.GET_COMMENT}`)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    data.forEach(comment => {
      const isoDate = comment.changed_at;
      const date = new Date(isoDate);
      const formattedDate = date.toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });

      const initials = (comment.changed_by || "")
        .split(" ")
        .map(word => word[0])
        .filter(Boolean)
        .join("")
        .substring(0, 2)
        .toUpperCase();

      const activitycommentContent = `
        <div class="media mb-4 d-flex align-items-center">
          <div class="avatar me-3 flex-shrink-0">
            <span class="avatar-initial bg-label-success rounded-circle">${initials}</span>
          </div>
          <div class="media-body">
            <p class="mb-0">${comment.change_description}</p>
            <small class="text-muted">${formattedDate}</small>
          </div>
        </div>
      `;

      activitycommentTab.insertAdjacentHTML(
        "beforeend",
        activitycommentContent
      );
    });
  })
  .catch(error => {
    console.error("Error fetching comments:", error);
  });

//fetch comments end
