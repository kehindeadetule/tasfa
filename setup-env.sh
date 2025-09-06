#!/bin/bash

# Setup script for TASFA environment variables
echo "Setting up TASFA environment variables..."

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists. Creating backup..."
    cp .env.local .env.local.backup
fi

# Create .env.local file with API configuration
cat > .env.local << EOF
# Backend API Configuration
# For local development, use your local backend server
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Environment (development, staging, production)
NEXT_PUBLIC_ENV=development

# Optional: JWT Secret for development (if needed)
# JWT_SECRET=your-development-secret-key
EOF

echo "✅ Created .env.local file with the following configuration:"
echo "   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001"
echo "   NEXT_PUBLIC_ENV=development"
echo ""
echo "🔒 Security Notes:"
echo "   - .env.local is gitignored and won't be committed"
echo "   - NEXT_PUBLIC_ variables are exposed to the browser"
echo "   - Never put sensitive secrets in NEXT_PUBLIC_ variables"
echo ""
echo "📝 To use a different backend URL:"
echo "   1. Edit .env.local"
echo "   2. Change NEXT_PUBLIC_API_BASE_URL to your backend URL"
echo ""
echo "🚀 Next steps:"
echo "   1. Start your backend server on port 3001"
echo "   2. Run: npm run dev"
echo "   3. Open http://localhost:3000"
