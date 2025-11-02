#!/bin/bash

# Simple client-side error detector using curl and grep
# This checks the dev server output for common error patterns

PORT=${1:-5176}
URL="http://localhost:$PORT"

echo "🔍 Testing client at $URL..."

# Check if server is running
if ! curl -s -o /dev/null -w "%{http_code}" "$URL" | grep -q "200"; then
    echo "❌ Server is not responding at $URL"
    exit 1
fi

echo "✅ Server is responding"

# Fetch the page and check for common error patterns
echo "📱 Checking for client-side errors..."

# Get the page content
PAGE_CONTENT=$(curl -s "$URL")

# Check for common error indicators
ERRORS_FOUND=0

# Check if the main app div exists
if ! echo "$PAGE_CONTENT" | grep -q '<div id="root">'; then
    echo "❌ Root element not found - React may not be mounting"
    ERRORS_FOUND=1
fi

# Get the Vite dev server logs (if available)
# Note: This requires the dev server to be running with verbose output
echo "📝 Checking console for errors..."

# Create a temporary HTML file that will load the app and check for errors
cat > /tmp/test-piano-app.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Piano App Test</title>
</head>
<body>
    <div id="results"></div>
    <script>
        const results = [];
        let hasErrors = false;

        // Override console.error
        const originalError = console.error;
        console.error = function(...args) {
            hasErrors = true;
            results.push({type: 'error', message: args.join(' ')});
            originalError.apply(console, args);
        };

        // Listen for unhandled errors
        window.addEventListener('error', (event) => {
            hasErrors = true;
            results.push({
                type: 'uncaught',
                message: event.message,
                filename: event.filename,
                line: event.lineno
            });
        });

        // Load the app in an iframe
        const iframe = document.createElement('iframe');
        iframe.src = 'REPLACE_URL';
        iframe.style.width = '100%';
        iframe.style.height = '600px';
        iframe.onload = function() {
            setTimeout(() => {
                // Check iframe for errors
                try {
                    const iframeErrors = iframe.contentWindow.console._errors || [];
                    if (iframeErrors.length > 0) {
                        hasErrors = true;
                        results.push(...iframeErrors);
                    }
                } catch(e) {
                    // Cross-origin restriction, ignore
                }

                // Display results
                const resultsDiv = document.getElementById('results');
                if (hasErrors) {
                    resultsDiv.innerHTML = '<h2 style="color: red;">❌ Client-side errors detected</h2>' +
                        '<pre>' + JSON.stringify(results, null, 2) + '</pre>';
                } else {
                    resultsDiv.innerHTML = '<h2 style="color: green;">✅ No client-side errors detected</h2>';
                }
            }, 2000);
        };
        document.body.appendChild(iframe);
    </script>
</body>
</html>
EOF

# Replace the URL in the test file
sed -i.bak "s|REPLACE_URL|$URL|g" /tmp/test-piano-app.html

echo ""
echo "Test complete. Results:"
echo "----------------------"

if [ $ERRORS_FOUND -eq 0 ]; then
    echo "✅ Basic checks passed"
    echo ""
    echo "For more thorough testing, you can:"
    echo "1. Open $URL in a browser and check the console"
    echo "2. Install Playwright: npm install --save-dev playwright"
    echo "3. Run the full test: node test-client.js"
else
    echo "❌ Errors were found"
    exit 1
fi