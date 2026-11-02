<?php
/**
 * Google Reviews Configuration
 * 
 * Instructions to get your Google API key and Place ID:
 * 
 * 1. Google API Key:
 *    - Go to Google Cloud Console (https://console.cloud.google.com/)
 *    - Create a new project or select existing one
 *    - Enable the "Places API" for your project
 *    - Go to "Credentials" and create an API Key
 *    - Restrict the API key to only use Places API for security
 * 
 * 2. Google Place ID:
 *    - Go to https://developers.google.com/maps/documentation/places/web-service/place-id
 *    - Use the Place ID Finder tool: https://developers.google.com/maps/documentation/places/web-service/place-id#find-id
 *    - Search for your business name and location
 *    - Copy the Place ID (it looks like: ChIJN1t_tDeuEmsRUsoyG83frY4)
 * 
 * Replace the values below with your actual credentials:
 */

return [
    'google_api_key' => getenv('GOOGLE_API_KEY') ?: '', // Set GOOGLE_API_KEY environment variable or populate here on server
    'google_place_id' => getenv('GOOGLE_PLACE_ID') ?: '', // Set GOOGLE_PLACE_ID environment variable or populate here on server

    // Optional: Configure how many reviews to fetch (max 5 per Google's policy)
    'max_reviews' => 5,

    // Optional: Configure log retention (in days)
    'log_retention_days' => 30,

    // Optional: Configure timezone for logging
    'timezone' => 'Asia/Kolkata'
];
?>