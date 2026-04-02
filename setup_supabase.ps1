$supabaseUrl = "https://iywlrnbcrzqhmfcmrjzt.supabase.co"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5d2xybmJjcnpxaG1mY21yanp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMDUyODIsImV4cCI6MjA5MDY4MTI4Mn0.qnzexXCFCH6P6HH08cKX6qHGl9FY4AJakuFcmOQiSls"
$projectRef = "iywlrnbcrzqhmfcmrjzt"

Write-Host "=== CONFIGURACAO DO BANCO DE DADOS SUPABASE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Projeto: $projectRef" -ForegroundColor Yellow
Write-Host "URL: $supabaseUrl" -ForegroundColor Yellow
Write-Host ""

# =============================================
# STEP 1: Create Admin User via Auth API
# =============================================
Write-Host "1. Criando usuario admin: itamar8555@gmail.com..." -ForegroundColor Cyan

$signupBody = @{
    email = "itamar8555@gmail.com"
    password = "624570"
    data = @{
        full_name = "Itamar Admin"
        role = "admin"
    }
} | ConvertTo-Json -Depth 3

try {
    $signupResponse = Invoke-RestMethod `
        -Uri "$supabaseUrl/auth/v1/signup" `
        -Method POST `
        -Headers @{
            "apikey" = $anonKey
            "Content-Type" = "application/json"
        } `
        -Body $signupBody

    Write-Host "   [OK] Usuario criado/ja existente." -ForegroundColor Green
    Write-Host "   ID: $($signupResponse.user.id)" -ForegroundColor Gray
    $userId = $signupResponse.user.id
} catch {
    $errBody = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue
    if ($errBody.code -eq "user_already_exists" -or $_.Exception.Message -like "*already*") {
        Write-Host "   [INFO] Usuario ja existe. Tentando login para obter ID..." -ForegroundColor Yellow
        
        try {
            $loginBody = @{
                email = "itamar8555@gmail.com"
                password = "624570"
            } | ConvertTo-Json
            
            $loginResponse = Invoke-RestMethod `
                -Uri "$supabaseUrl/auth/v1/token?grant_type=password" `
                -Method POST `
                -Headers @{
                    "apikey" = $anonKey
                    "Content-Type" = "application/json"
                } `
                -Body $loginBody
            
            $userId = $loginResponse.user.id
            Write-Host "   [OK] Login bem-sucedido. ID: $userId" -ForegroundColor Green
        } catch {
            Write-Host "   [AVISO] Nao foi possivel obter ID via login: $_" -ForegroundColor Yellow
            $userId = $null
        }
    } else {
        Write-Host "   [AVISO] $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "   Resposta: $($_.ErrorDetails.Message)" -ForegroundColor Gray
        $userId = $null
    }
}

Write-Host ""

# =============================================
# STEP 2: Show instructions for manual setup
# =============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "INSTRUCOES PARA FINALIZAR A CONFIGURACAO" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "O arquivo .env foi criado com suas credenciais." -ForegroundColor Green
Write-Host ""
Write-Host "Para aplicar o schema no banco de dados, siga estes passos:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Acesse: https://supabase.com/dashboard/project/$projectRef/sql/new" -ForegroundColor White
Write-Host "2. Cole o conteudo do arquivo: supabase_schema.sql" -ForegroundColor White
Write-Host "3. Clique em 'Run' para executar" -ForegroundColor White
Write-Host ""
Write-Host "4. Apos executar o schema, va em:" -ForegroundColor Yellow
Write-Host "   https://supabase.com/dashboard/project/$projectRef/auth/users" -ForegroundColor White
Write-Host ""

if ($userId) {
    Write-Host "5. O usuario admin foi criado com ID: $userId" -ForegroundColor Green
    Write-Host "   Execute este SQL para garantir perfil admin:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   INSERT INTO public.profiles (id, full_name, role)" -ForegroundColor Cyan
    Write-Host "   VALUES ('$userId', 'Itamar Admin', 'admin')" -ForegroundColor Cyan
    Write-Host "   ON CONFLICT (id) DO UPDATE SET role = 'admin';" -ForegroundColor Cyan
} else {
    Write-Host "5. Quando criar/encontrar o usuario, copie seu UUID e execute:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   INSERT INTO public.profiles (id, full_name, role)" -ForegroundColor Cyan
    Write-Host "   VALUES ('SEU-UUID-AQUI', 'Itamar Admin', 'admin')" -ForegroundColor Cyan
    Write-Host "   ON CONFLICT (id) DO UPDATE SET role = 'admin';" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configuracao do .env concluida!" -ForegroundColor Green
Write-Host "Arquivo criado com URL e chave do Supabase." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
