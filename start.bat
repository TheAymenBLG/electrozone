@echo off
REM One-click launcher for Windows. Double-click this file.
cd /d "%~dp0"

echo ========================================
echo   ElectroZone - demarrage
echo ========================================

REM Fix for the common Vite/Rollup "Cannot find module @rollup/rollup-win32-x64-msvc"
REM crash: if node_modules looks broken, do a clean install.
if not exist "node_modules\vite" goto install
if not exist "node_modules\@rollup\rollup-win32-x64-msvc" goto cleaninstall
goto run

:cleaninstall
echo Reparation des dependances (Rollup Windows manquant)...
if exist package-lock.json del /f /q package-lock.json
rmdir /s /q node_modules
:install
echo Installation des dependances (1 minute environ)...
call npm install
if errorlevel 1 goto error

:run
echo.
echo Lancement du serveur. Ouvrez l'adresse http://localhost:5173 dans votre navigateur.
echo (Fermez cette fenetre ou appuyez sur Ctrl+C pour arreter.)
echo.
call npm run dev
goto end

:error
echo.
echo Une erreur est survenue pendant l'installation. Copiez le texte ci-dessus.
pause

:end
