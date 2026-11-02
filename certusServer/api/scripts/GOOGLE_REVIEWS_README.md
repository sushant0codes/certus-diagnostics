# Google Reviews Automation

This system automatically fetches Google Reviews for your business and stores them in your database.

## Features

- Fetches up to 5 recent reviews from Google Places API
- Stores reviews in MySQL database with duplicate prevention
- Runs automatically via cron job
- Provides API endpoints to access reviews
- Comprehensive logging and error handling
- Easy configuration and setup

## Setup Instructions

### 1. Database Setup

Your `google_reviews` table is already created. Verify it exists:

```sql
DESCRIBE google_reviews;
```

### 2. Get Google API Credentials

#### Google API Key:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Places API" for your project
4. Go to "Credentials" and create an API Key
5. Restrict the API key to only use Places API for security

#### Google Place ID:
1. Use the [Place ID Finder tool](https://developers.google.com/maps/documentation/places/web-service/place-id#find-id)
2. Search for your business name and location
3. Copy the Place ID (format: `ChIJN1t_tDeuEmsRUsoyG83frY4`)

### 3. Configure the System

Edit `config/google_reviews_config.php`:

```php
return [
    'google_api_key' => 'YOUR_ACTUAL_API_KEY_HERE',
    'google_place_id' => 'YOUR_ACTUAL_PLACE_ID_HERE',
    'max_reviews' => 5,
    'log_retention_days' => 30,
    'timezone' => 'Asia/Kolkata'
];
```

### 4. Test the Setup

Run the test script to verify everything works:

```bash
php scripts/test_google_reviews.php
```

### 5. Set Up Cron Job

Run the setup script:

```bash
chmod +x scripts/setup_cron.sh
./scripts/setup_cron.sh
```

Or manually add to crontab:

```bash
crontab -e
```

Add this line (runs daily at 9 AM):

```
0 9 * * * /usr/bin/php "/Applications/XAMPP/xamppfiles/htdocs/certusServer/scripts/fetch_google_reviews.php" >> "/Applications/XAMPP/xamppfiles/htdocs/certusServer/logs/cron.log" 2>&1
```

## API Endpoints

### Get All Reviews
```
GET /api/google-reviews.php
GET /api/google-reviews.php?limit=10&page=1
```

### Get Review Statistics
```
GET /api/google-reviews.php?stats=1
```

### Search Reviews
```
GET /api/google-reviews.php?search=excellent
```

### Filter by Rating
```
GET /api/google-reviews.php?rating=5
```

## Manual Operations

### Fetch Reviews Manually
```bash
php scripts/fetch_google_reviews.php
```

### View Logs
```bash
tail -f logs/google_reviews_$(date +%Y-%m).log
tail -f logs/cron.log
```

## File Structure

```
certusServer/
├── config/
│   └── google_reviews_config.php     # Configuration file
├── models/
│   └── GoogleReview.php              # Database model
├── controllers/
│   └── GoogleReviewController.php    # API controller
├── scripts/
│   ├── fetch_google_reviews.php      # Main fetching script
│   ├── test_google_reviews.php       # Test script
│   └── setup_cron.sh                 # Cron setup helper
├── api/
│   └── google-reviews.php            # API endpoint
└── logs/
    ├── google_reviews_*.log           # Application logs
    └── cron.log                       # Cron job logs
```

## Usage Examples

### Frontend Integration

```javascript
// Get all reviews
const reviews = await fetch('/api/google-reviews.php')
  .then(response => response.json());

// Get statistics
const stats = await fetch('/api/google-reviews.php?stats=1')
  .then(response => response.json());

console.log(`Average rating: ${stats.data.average_rating}`);
console.log(`Total reviews: ${stats.data.total_reviews}`);
```

### Display Reviews in React

```jsx
function GoogleReviews() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Fetch reviews
    fetch('/api/google-reviews.php?limit=5')
      .then(response => response.json())
      .then(data => setReviews(data.data));

    // Fetch stats
    fetch('/api/google-reviews.php?stats=1')
      .then(response => response.json())
      .then(data => setStats(data.data));
  }, []);

  return (
    <div>
      {stats && (
        <div>
          <h3>Average Rating: {stats.average_rating}/5</h3>
          <p>Based on {stats.total_reviews} reviews</p>
        </div>
      )}
      
      {reviews.map(review => (
        <div key={review.id}>
          <h4>{review.author}</h4>
          <div>Rating: {review.rating}/5</div>
          <p>{review.review_text}</p>
          <small>{review.review_time}</small>
        </div>
      ))}
    </div>
  );
}
```

## Troubleshooting

### Common Issues

1. **"API key not configured"**
   - Update `config/google_reviews_config.php` with your actual credentials

2. **"Google API Error: INVALID_REQUEST"**
   - Check your Place ID is correct
   - Ensure Places API is enabled in Google Cloud Console

3. **"Google API Error: REQUEST_DENIED"**
   - Verify API key restrictions
   - Check API key has Places API access

4. **"Database connection failed"**
   - Verify database credentials in `config/database.php`
   - Ensure MySQL is running

5. **Cron job not running**
   - Check cron service: `sudo service cron status`
   - Verify crontab: `crontab -l`
   - Check file permissions

### Log Files

- **Application logs**: `logs/google_reviews_YYYY-MM.log`
- **Cron logs**: `logs/cron.log`
- **Error logs**: Check your web server error logs

### Testing

Run individual components:

```bash
# Test database connection
php -r "require 'config/database.php'; new Database();"

# Test API endpoint
curl "http://localhost/certusServer/api/google-reviews.php?stats=1"

# Test complete system
php scripts/test_google_reviews.php
```

## Security Notes

- Keep your Google API key secure and restricted
- Monitor API usage in Google Cloud Console
- Regularly check logs for suspicious activity
- Use HTTPS in production environments

## Support

Check the logs for detailed error messages and refer to:
- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [PHP Manual](https://www.php.net/manual/)
- [Cron Documentation](https://man7.org/linux/man-pages/man5/crontab.5.html)
