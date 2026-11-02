<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certus API - Environment Status</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 40px;
            max-width: 600px;
            width: 100%;
        }
        h1 {
            color: #2d3748;
            margin-bottom: 10px;
            font-size: 32px;
        }
        .subtitle {
            color: #718096;
            margin-bottom: 30px;
            font-size: 16px;
        }
        .status-card {
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 20px;
            text-align: center;
        }
        .status-card.development {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .status-card.production {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
        }
        .status-icon { font-size: 48px; margin-bottom: 15px; }
        .status-title { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .status-description { font-size: 14px; opacity: 0.9; }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 30px;
        }
        .info-item {
            background: #f7fafc;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .info-label {
            font-size: 12px;
            color: #718096;
            margin-bottom: 5px;
            text-transform: uppercase;
            font-weight: 600;
        }
        .info-value {
            font-size: 14px;
            color: #2d3748;
            font-weight: 500;
            word-break: break-all;
        }
        .warning {
            background: #fff5f5;
            border-left: 4px solid #f56565;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .warning-title { color: #c53030; font-weight: bold; margin-bottom: 5px; }
        .warning-text { color: #742a2a; font-size: 14px; }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #718096;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 Certus API Status</h1>
        <p class="subtitle">Environment Configuration Dashboard</p>
        
        <?php
        require_once __DIR__ . '/config/environment.php';
        
        $isDevelopment = (ENVIRONMENT === 'development');
        $statusClass = $isDevelopment ? 'development' : 'production';
        $statusIcon = $isDevelopment ? '💻' : '🚀';
        $statusTitle = $isDevelopment ? 'Development Mode' : 'Production Mode';
        $statusDesc = $isDevelopment 
            ? 'Running on local XAMPP server' 
            : 'Running on live Hostinger server';
        ?>
        
        <div class="status-card <?php echo $statusClass; ?>">
            <div class="status-icon"><?php echo $statusIcon; ?></div>
            <div class="status-title"><?php echo $statusTitle; ?></div>
            <div class="status-description"><?php echo $statusDesc; ?></div>
        </div>
        
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Database</div>
                <div class="info-value"><?php echo DB_NAME; ?></div>
            </div>
            <div class="info-item">
                <div class="info-label">DB Host</div>
                <div class="info-value"><?php echo DB_HOST; ?></div>
            </div>
            <div class="info-item">
                <div class="info-label">Base URL</div>
                <div class="info-value"><?php echo BASE_URL; ?></div>
            </div>
            <div class="info-item">
                <div class="info-label">Upload Path</div>
                <div class="info-value"><?php echo basename(UPLOAD_PATH); ?></div>
            </div>
        </div>
        
        <?php if (ENVIRONMENT === 'production'): ?>
        <div class="warning">
            <div class="warning-title">⚠️ Production Mode Active</div>
            <div class="warning-text">
                You are connected to the LIVE database. Changes will affect real users!
            </div>
        </div>
        <?php endif; ?>
        
        <div class="footer">
            <p><strong>To change environment:</strong> Edit api/config/environment.php, Line 11</p>
            <p style="margin-top: 5px;">Certus Diagnostics © <?php echo date('Y'); ?></p>
        </div>
    </div>
</body>
</html>
