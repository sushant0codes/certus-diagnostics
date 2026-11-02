# Docker development setup

This Compose setup starts the complete local stack:

- Patient React/Vite app: http://localhost:5173
- Admin React/Vite app: http://localhost:5174
- PHP/Apache API: http://localhost:8080
- MySQL: localhost:3306

## Start

1. Copy `.env.example` to `.env` and set `VITE_GOOGLE_CLIENT_ID` if you want to test Google Sign-In.
2. From the repository root, run:

   ```powershell
   docker compose up --build
   ```

3. Open the client or admin URL above. The API health endpoint is available at http://localhost:8080/api/health.

The database schema is initialized from `certusServer/api/hostinger_database_setup.sql` only when the `mysql_data` volume is first created.

## Reset local Docker data

To discard the local database and uploaded reports, stop the stack and remove its volumes:

```powershell
docker compose down -v
```

This affects only Docker-managed local data, not your source files.
