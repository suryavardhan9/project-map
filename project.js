// 1. Initialize the map and set its view
const map = L.map('map').setView([20, 0], 2);

// 2. Add the 'CartoDB Dark Matter' tile layer for a sleek look
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    noWrap: false,      // Allows the map to repeat horizontally
    bounds: [ [-90, -180], [90, 180] ], // Helps with world constraints
    minZoom: 2          // Prevents zooming out so far that the map looks tiny
}).addTo(map);

// 3. Force the map to fill the container immediately
setTimeout(() => {
    map.invalidateSize();
}, 100);

// 4. Disable default zoom position and add it to the bottom-right
map.zoomControl.remove();
L.control.zoom({
    position: 'bottomright'
}).addTo(map);

// 5. Add a sample marker (Main HQ)
const marker = L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('<b>Main HQ</b><br>London, UK.')
    .openPopup();

// ---------------------------------------------------------
// UI INTERACTION FUNCTIONS
// ---------------------------------------------------------

// Handle the search bar opening/closing
function toggleSearch() {
    document.getElementById('searchWrapper').classList.toggle('open');
}

// Handle the sidebar toggling safely (Checks if it exists first)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

// ---------------------------------------------------------
// RESPONSIVE BEHAVIOR
// ---------------------------------------------------------

// Ensure map resizes correctly on window change and handle sidebar
window.addEventListener('resize', () => {
    map.invalidateSize();
    
    // Optional: Close sidebar automatically on small screens (Safely)
    const sidebar = document.getElementById('sidebar');
    if (sidebar && window.innerWidth < 768) {
        sidebar.classList.add('collapsed');
    }
});

// Run the responsive sidebar check once on initial load
const sidebar = document.getElementById('sidebar');
if (sidebar && window.innerWidth < 768) {
    sidebar.classList.add('collapsed');
}

// ---------------------------------------------------------
// SEARCH & MAPPING LOGIC
// ---------------------------------------------------------

// Store the search marker globally so we can remove it later
let currentSearchMarker = null;

// Improved Search with auto-zoom and marker management
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

            // Remove the previous search marker if it exists
            if (currentSearchMarker) {
                map.removeLayer(currentSearchMarker);
            }

            // Add a new custom themed marker and save it to the variable
            currentSearchMarker = L.marker([lat, lon]).addTo(map)
                .bindPopup(`<div style="color:black"><b>${display_name}</b></div>`)
                .openPopup();
        } else {
            alert("Location not found. Please try a different search.");
        }
    } catch (error) {
        console.error("Search failed", error);
        alert("An error occurred while searching. Check your connection.");
    } finally {
        btn.innerText = "Go"; // Reset button text
    }
}