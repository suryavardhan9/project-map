// Initialize the map and set its view
const map = L.map('map').setView([20, 0], 2);

// Add the 'CartoDB Dark Matter' tile layer for a sleek look
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    noWrap: false,      // Allows the map to repeat horizontally
    bounds: [ [-90, -180], [90, 180] ], // Helps with world constraints
    minZoom: 2          // Prevents zooming out so far that the map looks tiny
}).addTo(map);

// Force the map to fill the container immediately
setTimeout(() => {
    map.invalidateSize();
}, 100);
// Disable default zoom position and add it to the bottom-right
map.zoomControl.remove();
L.control.zoom({
    position: 'bottomright'
}).addTo(map);
// Add a sample marker
const marker = L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('<b>Main HQ</b><br>London, UK.')
    .openPopup();

// Function to move map view

// Function 1: Handle the UI opening/closing
function toggleSearch() {
    document.getElementById('searchWrapper').classList.toggle('open');
}

// Function 2: Handle the actual location search
async function findLocation() {
    const query = document.getElementById('locationInput').value;
    if (!query) return;

    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
    const data = await response.json();

    if (data.length > 0) {
        const lat = data[0].lat;
        const lon = data[0].lon;
        map.flyTo([lat, lon], 12);
        L.marker([lat, lon]).addTo(map).bindPopup(query).openPopup();
    }
}
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

// Optional: Close sidebar automatically on small screens
if (window.innerWidth < 768) {
    document.getElementById('sidebar').classList.add('collapsed');
}
// Ensure map resizes correctly on window change
window.addEventListener('resize', () => {
    map.invalidateSize();
});

// Improved Search with auto-zoom
async function findLocation() {
    const query = document.getElementById('locationInput').value;
    const btn = document.querySelector('.find-btn');
    
    if (!query) return;

    btn.innerText = "..."; // Loading state

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
        const data = await response.json();

        if (data.length > 0) {
            const { lat, lon, display_name } = data[0];

            // Smoothly fly to location
            map.flyTo([lat, lon], 14, {
                animate: true,
                duration: 2.0 
            });

            // Add a custom themed marker
            L.marker([lat, lon]).addTo(map)
                .bindPopup(`<div style="color:black"><b>${display_name}</b></div>`)
                .openPopup();
        }
    } catch (error) {
        console.error("Search failed", error);
    } finally {
        btn.innerText = "Go";
    }
}