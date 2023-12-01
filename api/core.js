// API endpoint for posts
const apiUrl = "http://localhost:3000/posts";
// Reference to the HTML element with the id "blog"
const blog = document.getElementById("blog");

// Function to fetch posts from the local API
const getLocalApi = () => fetch(apiUrl).then(response => response.json());

// Function to display posts on the webpage
const displayData = () =>
  getLocalApi().then(data => {
    // Sort posts by ID in descending order
    const sortedData = data.sort((a, b) => b.id - a.id);
    // Clear existing content in the blog element
    blog.innerHTML = "";

    // Iterate through each post and create a card for display
    sortedData.forEach(post => {
      const card = document.createElement("div");
      card.className = "card mb-2";
      card.style = "width: 18rem;";

      card.innerHTML = `
          <div class="card-body">
              <h5 class="card-title">${post.title} ${post.id}</h5>
              <p class="card-text">${post.body}</p>
              <p class="card-text"><small class="text-muted">${post.author}</small></p>
              <button class="btn btn-primary" data-id="${post.id}" onclick="editPost(${post.id})">Edit</button>
              <button class="btn btn-danger" data-id="${post.id}" onclick="deletePost(${post.id})">Delete</button>
          </div>
      `;

      blog.appendChild(card);
    });
  });

// Function to post data to the local API
const postLocalApi = postData =>
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
  }).then(response => response.json());

// Function to handle form submission
const submitData = () => {
  // Get values from form elements
  const title = document.getElementById("title").value;
  const body = quill.root.innerHTML;
  const author = document.getElementById("author").value;

  // Check if any field is empty
  if (title === "" || body === "" || author === "") {
    alert("Please fill all the fields");
    return;
  }

  // Create post data object
  const postData = { title, body, author };

  // Post data to the local API and update display
  postLocalApi(postData).then(() => {
    // Clear form fields
    document.getElementById("title").value = "";
    quill.root.innerHTML = "";
    document.getElementById("author").value = "";
    displayData();
  });
};

// Function to edit a post
const editPost = postId => {
  // Prompt user for new title
  const newTitle = prompt("Enter the new title:");

  // Check if the title prompt was not canceled
  if (newTitle !== null) {
    // Prompt user for new author and body
    const newAuthor = prompt("Enter the new author:");
    const newBody = prompt("Enter the new body:");

    // Check if both author and body prompts were not canceled
    if (newAuthor !== null && newBody !== null) {
      // Fetch API to update the post
      fetch(`${apiUrl}/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTitle, author: newAuthor, body: newBody })
      })
        .then(response => response.json())
        .then(() => displayData());
    }
  }
};

// Function to delete a post
const deletePost = postId => {
  // Confirm deletion with the user
  const confirmDelete = confirm("Are you sure you want to delete this post?");
  if (confirmDelete) {
    // Fetch API to delete the post and update display
    fetch(`${apiUrl}/${postId}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(() => displayData());
  }
};

// Initial display of posts on page load
displayData();

// Event listener for form submission
document.getElementById("submit").addEventListener("click", submitData);
