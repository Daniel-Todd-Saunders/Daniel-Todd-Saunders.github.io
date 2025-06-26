
// Specify redirect paths
const routes = {
    '/about': 'about.html',
    '/resume': 'resume.html'
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