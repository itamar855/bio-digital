const https = require('https');

const PROJECT_REF = 'iywlrnbcrzqhmfcmrjzt';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5d2xybmJjcnpxaG1mY21yanp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMDUyODIsImV4cCI6MjA5MDY4MTI4Mn0.qnzexXCFCH6P6HH08cKX6qHGl9FY4AJakuFcmOQiSls';

function makeRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function main() {
  console.log('=== SETUP SUPABASE - BIO-DIGITAL ===\n');

  // Step 1: Try to create admin user (may fail if schema not applied yet)
  console.log('Passo 1: Criando usuario admin...');
  const signupBody = JSON.stringify({
    email: 'itamar8555@gmail.com',
    password: '624570',
    options: {
      data: {
        full_name: 'Itamar Admin',
        role: 'admin'
      }
    }
  });

  const signupResult = await makeRequest({
    hostname: `${PROJECT_REF}.supabase.co`,
    path: '/auth/v1/signup',
    method: 'POST',
    headers: {
      'apikey': ANON_KEY,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(signupBody)
    }
  }, signupBody);

  console.log(`   Status: ${signupResult.status}`);
  
  if (signupResult.status === 200 && signupResult.body.user) {
    const userId = signupResult.body.user.id;
    console.log(`   ✅ Usuario criado!`);
    console.log(`   ID: ${userId}`);
    console.log(`   Email: ${signupResult.body.user.email}`);
    printInstructions(userId);
  } else {
    console.log(`   Resposta: ${JSON.stringify(signupResult.body).substring(0, 200)}`);
    
    if (signupResult.body.code === 500) {
      console.log('\n   ⚠️  ERRO 500: O schema do banco ainda nao foi aplicado!');
      console.log('   O trigger quebra quando as tabelas nao existem.');
    }
    
    console.log('\n--- INSTRUCOES PARA CONFIGURAR MANUALMENTE ---\n');
    printManualInstructions();
  }
}

function printInstructions(userId) {
  console.log('\n=== PROXIMOS PASSOS ===\n');
  console.log('1. Acesse o SQL Editor do Supabase:');
  console.log(`   https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new\n`);
  console.log('2. Execute o arquivo "supabase_schema.sql" (cole o conteudo e clique Run)\n');
  console.log('3. Depois execute este SQL para configurar seu usuario como Admin:');
  console.log('   ┌─────────────────────────────────────────────────────────┐');
  console.log(`   │ INSERT INTO public.profiles (id, full_name, role)       │`);
  console.log(`   │ VALUES ('${userId}',                    │`);
  console.log(`   │        'Itamar Admin', 'admin')                         │`);
  console.log(`   │ ON CONFLICT (id) DO UPDATE SET role = 'admin';          │`);
  console.log('   └─────────────────────────────────────────────────────────┘\n');
}

function printManualInstructions() {
  const sqlEditor = `https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`;
  const authUsers = `https://supabase.com/dashboard/project/${PROJECT_REF}/auth/users`;
  
  console.log('PASSO 1: Aplicar o Schema');
  console.log(`  Acesse: ${sqlEditor}`);
  console.log('  Cole o conteudo do arquivo "supabase_schema.sql" e clique Run\n');
  
  console.log('PASSO 2: Criar usuario Admin (apos aplicar schema)');
  console.log(`  Acesse: ${authUsers}`);
  console.log('  Clique "Add user" -> "Create new user"');
  console.log('  Email: itamar8555@gmail.com');
  console.log('  Password: 624570\n');
  
  console.log('PASSO 3: Definir role como Admin');
  console.log(`  Volte ao SQL Editor: ${sqlEditor}`);
  console.log('  Copie o UUID do usuario e execute:');
  console.log("  INSERT INTO public.profiles (id, full_name, role)");
  console.log("  VALUES ('SEU-UUID', 'Itamar Admin', 'admin')");
  console.log("  ON CONFLICT (id) DO UPDATE SET role = 'admin';\n");
  console.log(`  Ou use: UPDATE public.profiles SET role = 'admin' WHERE id = 'SEU-UUID';`);
  
  console.log('\nPASSO 4: Rodar o projeto');
  console.log('  npm run dev');
  console.log('  Acesse http://localhost:5173 e faca login com itamar8555@gmail.com / 624570');
}

main().catch(console.error);
