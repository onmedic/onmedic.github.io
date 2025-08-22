#!/bin/bash
set -e

echo "🏗️  Building onmedic static site..."

# Variables
BASE_URL="https://onmedic.com"
SITE_NAME="onmedic"

# Crear directoris de build
echo "📁 Creating build directories..."
rm -rf build/
mkdir -p build/assets/{css,js,images,fonts}

# Copiar fitxers estàtics
echo "📄 Copying static files..."
cp index.html build/
cp robots.txt build/
cp sitemap.xml build/
cp sw.js build/
cp -r src/assets/ build/

# Copiar scripts
cp -r src/scripts/ build/assets/js/
cp -r src/styles/ build/assets/css/

# Copiar configuracions
cp -r config/ build/

# Substituir variables (si n'hi ha)
echo "🔄 Processing templates..."
sed -i.bak "s|{{BASE_URL}}|$BASE_URL|g" build/sitemap.xml || true
sed -i.bak "s|{{SITE_NAME}}|$SITE_NAME|g" build/index.html || true
rm -f build/*.bak

# Validacions bàsiques
echo "🔍 Running basic validations..."

# Verificar que els fitxers crítics existeixen
required_files=("build/index.html" "build/robots.txt" "build/sitemap.xml" "build/sw.js")
for file in "${required_files[@]}"; do
    if [[ ! -f "$file" ]]; then
        echo "❌ Missing required file: $file"
        exit 1
    fi
done

# Verificar meta descriptions
echo "📝 Checking meta descriptions..."
if ! grep -q "meta.*description" build/index.html; then
    echo "⚠️  Warning: Missing meta description"
fi

# Verificar structured data
if grep -q "application/ld+json" build/index.html; then
    echo "✅ Structured data found"
else
    echo "⚠️  Warning: No structured data found"
fi

# Informació sobre el build
echo ""
echo "📊 Build Information:"
echo "   - Total files: $(find build -type f | wc -l)"
echo "   - HTML files: $(find build -name '*.html' | wc -l)"
echo "   - CSS files: $(find build -name '*.css' | wc -l)"
echo "   - JS files: $(find build -name '*.js' | wc -l)"

# Calcular mida total
total_size=$(du -sh build 2>/dev/null | cut -f1 || echo "Unknown")
echo "   - Total size: $total_size"

echo ""
echo "✅ Build completed successfully!"
echo "📁 Output directory: build/"
echo ""
echo "🚀 Ready to deploy to GitHub Pages:"
echo "   1. Push changes to main branch"
echo "   2. Enable GitHub Pages in repository settings"
echo "   3. Set source to 'Deploy from a branch' and select 'main'"
echo ""
echo "🔧 Testing locally:"
echo "   python3 -m http.server 8000"
echo "   Then visit: http://localhost:8000"