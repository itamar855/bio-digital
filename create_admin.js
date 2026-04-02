const https = require('https');

const supabaseUrl = 'iywlrnbcrzqhmfcmrjzt.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5d2xybmJjcnpxaG1mY21yanp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMDUyODIsImV4cCI6MjA5MDY4MTI4Mn0.qnzexXCFCH6P6HH08cKX6qHGl9FY4AJakuFcmOQiSls';

const body = JSON.stringify({
  email: 'itamar8555@gmail.com',
  password: '624570',
  data: {
    full_name: 'Itamar Admin',
    role: 'admin'
  }
});

const options = {
  hostname: supabaseUrl,
  path: '/auth/v1/signup',
  method: 'POST',
  headers: {
    'apikey': anonKey,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  }
};

console.log('Criando usuario admin: itamar8555@gmail.com...');

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.user && parsed.user.id) {
        console.log('✅ Usuario criado com sucesso!');
        console.log('   ID:', parsed.user.id);
        console.log('   Email:', parsed.user.email);
        console.log('   Role (metadata):', parsed.user.user_metadata?.role);
        console.log('\n📋 SQL para garantir perfil admin - execute no SQL Editor do Supabase:');
        console.log(`INSERT INTO public.profiles (id, full_name, role)`);
        console.log(`VALUES ('${parsed.user.id}', 'Itamar Admin', 'admin')`);
        console.log(`ON CONFLICT (id) DO UPDATE SET role = 'admin';`);
      } else if (parsed.code === 'user_already_exists' || (parsed.msg && parsed.msg.includes('already'))) {
        console.log('⚠️  Usuario ja existe! Fazendo login para obter o ID...');
        loginUser();
      } else {
        console.log('Resposta:', JSON.stringify(parsed, null, 2));
      }
    } catch (e) {
      console.log('Resposta raw:', data);
    }
  });
});

req.on('error', (e) => console.error('Erro:', e.message));
req.write(body);
req.end();

function loginUser() {
  const loginBody = JSON.stringify({
    email: 'itamar8555@gmail.com',
    password: '624570'
  });

  const loginOptions = {
    hostname: supabaseUrl,
    path: '/auth/v1/token?grant_type=password',
    method: 'POST',
    headers: {
      'apikey': anonKey,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginBody)
    }
  };

  const loginReq = https.request(loginOptions, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.user && parsed.user.id) {
          console.log('✅ Login bem-sucedido!');
          console.log('   ID:', parsed.user.id);
          console.log('   Email:', parsed.user.email);
          console.log('\n📋 SQL para garantir perfil admin - execute no SQL Editor do Supabase:');
          console.log(`INSERT INTO public.profiles (id, full_name, role)`);
          console.log(`VALUES ('${parsed.user.id}', 'Itamar Admin', 'admin')`);
          console.log(`ON CONFLICT (id) DO UPDATE SET role = 'admin';`);
        } else {
          console.log('Resposta login:', JSON.stringify(parsed, null, 2));
        }
      } catch (e) {
        console.log('Resposta raw:', data);
      }
    });
  });

  loginReq.on('error', (e) => console.error('Erro login:', e.message));
  loginReq.write(loginBody);
  loginReq.end();
}
