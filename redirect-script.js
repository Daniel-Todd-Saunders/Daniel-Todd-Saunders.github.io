// Define a simple routing function
const routes = {
    '/about': 'about.html',
    '/contact': 'contact.html',
    // Add more routes as needed
};

// Get the current path
const path = window.location.pathname;

// If there's a matching route, load that page's content
if (routes[path]) {
    fetch(routes[path])
    .then(response => response.text())
    .then(data => {
        document.getElementById('content').innerHTML = data;
    })
    .catch(err => {
        console.error('Error loading page:', err);
        document.getElementById('content').innerHTML = 'Page not found.';
    });
} else {
    document.getElementById('content').innerHTML = 'Page not found.';
}