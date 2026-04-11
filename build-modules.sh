#!/usr/bin/env bash
# =============================================================
# build-modules.sh — Бүх React модулиудыг build хийж,
# JSF webapp руу хуулах скрипт
# =============================================================
set -e

# Homebrew / system Node PATH тохируулна (non-interactive shell-д хэрэгтэй)
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

ROOT="$(cd "$(dirname "$0")" && pwd)"
JSF_WEB="$ROOT/jsf-host/src/main/webapp/microfrontends"

echo "========================================"
echo " React Микрофронтэнд Build Script"
echo "========================================"

build_module() {
  local MODULE=$1
  local DEST="$JSF_WEB/$MODULE/dist"

  echo ""
  echo "▶ $MODULE: npm install..."
  cd "$ROOT/$MODULE"
  npm install --silent

  echo "▶ $MODULE: vite build..."
  npm run build

  echo "▶ $MODULE: JSF webapp руу хуулж байна..."
  mkdir -p "$DEST"
  cp -r dist/. "$DEST/"
  echo "✓ $MODULE: $(ls dist/ | wc -l | tr -d ' ') файл хуулагдлаа"
}

# ---------- Vite+TypeScript модулиуд ----------
build_module "module-admin"
build_module "module-teacher"
build_module "module-student"

echo ""
echo "========================================"
echo " Build амжилттай дууслаа! ✓"
echo "========================================"
echo ""
echo " JSF хостыг эхлүүлнэ үү:"
echo "   cd jsf-host && mvn tomcat7:run"
echo ""
echo " URL-ууд:"
echo "   Нүүр хуудас  : http://localhost:8080"
echo "   Admin         : http://localhost:8080/admin.xhtml"
echo "   Teacher       : http://localhost:8080/teacher.xhtml"
echo "   Student       : http://localhost:8080/student.xhtml"
echo "========================================"
