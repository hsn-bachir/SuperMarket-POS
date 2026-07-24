Start-Process powershell `
    -ArgumentList "-WindowStyle Hidden -Command `"cd backend; .\venv\Scripts\Activate.ps1; python manage.py runserver`"" `
    -WindowStyle Hidden


Start-Process powershell `
    -ArgumentList "-WindowStyle Hidden -Command `"cd erp-frontend; npm run dev`"" `
    -WindowStyle Hidden

Start-Sleep -Seconds 3

Start-Process "http://localhost:5173/"

# $root = Split-Path -Parent $MyInvocation.MyCommand.Path


# Start-Process powershell `
#     -ArgumentList "-WindowStyle Hidden -Command `"cd '$root\backend'; .\venv\Scripts\Activate.ps1; python manage.py runserver`"" `
#     -WindowStyle Hidden


# Start-Process powershell `
#     -ArgumentList "-WindowStyle Hidden -Command `"cd '$root\erp-frontend'; npm run dev`"" `
#     -WindowStyle Hidden


# Start-Sleep -Seconds 5

# Start-Process "http://localhost:5173/"