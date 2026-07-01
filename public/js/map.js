//APNA COLLEGE	 
         
/*
         // TO MAKE THE MAP APPEAR YOU MUST
	        // ADD YOUR ACCESS TOKEN FROM
	        // https://account.mapbox.com
            // let mapToken = "<%= process.env.MAP_TOKEN %>"; 
            // mapToken = mapToken;
            // console.log(mapToken);
            mapboxgl.accessToken = mapToken;
            const map = new mapboxgl.Map({
            container: 'map', // container ID
            //center has the longitude and latitude of the location you want to show on the map. You can get this from the geocoded data of your listing
            //center:[longitude, latitude]
            center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
            zoom: 9 // starting zoom
            });


// //MARKER

const marker1 = new mapboxgl.Marker({color:"red"})
        .setLngLat(listing.geometry.coordinates) // set the marker at the same coordinates as the center of the map
        //popup near marker
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(`<h3>${listing.location}</h3><p>Exact Location of the listing</p>`)) // add popups
        .addTo(map);

*/



// // public/js/map.js
// mapboxgl.accessToken = mapToken;

// // Check if coordinates exist and are not empty
// const hasCoordinates = listing.geometry && 
//                      listing.geometry.coordinates && 
//                      listing.geometry.coordinates.length === 2;

// // Fallback to placeholder coordinates if array is empty [] so it doesn't crash
// const mapCenter = hasCoordinates ? listing.geometry.coordinates : [77.2090, 28.6139];

// const map = new mapboxgl.Map({
//     container: 'map', 
//     style: 'mapbox://styles/mapbox/streets-v12', 
//     center: mapCenter, 
//     zoom: hasCoordinates ? 9 : 2 // Zoom out to world level if it's a fallback location
// });

// // Only add a marker if we actually have valid coordinates
// if (hasCoordinates) {
//     new mapboxgl.Marker({ color: "red" })
//         .setLngLat(mapCenter)
//         .setPopup(
//             new mapboxgl.Popup({ offset: 25 })
//             .setHTML(`<h4>${listing.title}</h4><p>Exact Location of the listing</p>`)
//         )
//         .addTo(map);
// }


// // public/js/map.js
mapboxgl.accessToken = mapToken;

// 1. Determine safe coordinates to avoid crashing
const hasCoordinates = listing.geometry && 
                       listing.geometry.coordinates && 
                       listing.geometry.coordinates.length === 2 &&
                       listing.geometry.coordinates[0] !== 0;

// If coordinates are valid, use them. Otherwise, default to Delhi [Lng, Lat]
const mapCenter = hasCoordinates ? listing.geometry.coordinates : [77.2090, 28.6139];

// 2. Initialize the map
const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v12', 
    center: mapCenter, 
    zoom: hasCoordinates ? 10 : 2 // Zoom in if coordinates are real, zoom out if placeholder
});

// 3. Drop the marker at the map's center
new mapboxgl.Marker({ color: "red" })
    .setLngLat(mapCenter)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h4>${listing.title || "Listing Location"}</h4><p>Exact location provided after booking</p>`)
    )
    .addTo(map);