import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const envPath = path.join(projectRoot, '.env');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const values = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    values[key] = value.replace(/^['"]|['"]$/g, '');
  }

  return values;
}

const env = {
  ...loadEnvFile(envPath),
  ...process.env,
};

const apiBaseUrl = env.API_URL || env.VITE_API_URL || 'http://localhost:3000/api';
const email = env.SEED_ADMIN_EMAIL || 'admin@tp.com';
const password = env.SEED_ADMIN_PASSWORD || 'Admin123!';

const booksToCreate = [
  { title: 'El Principito', description: 'Un pequeño príncipe viaja por el universo para descubrir el sentido de la amistad, el amor y la responsabilidad.' },
  { title: 'Clean Code', description: 'Una guía práctica para escribir software legible, mantenible y de calidad, con ejemplos claros y directos.' },
  { title: 'Fundación', description: 'Una historia épica sobre el fin de una civilización y el nacimiento de una nueva era en un futuro lejano.' },
  { title: '1984', description: 'Una novela distópica que explora vigilancia, censura y el poder absoluto del Estado sobre la verdad.' },
  { title: 'El Aleph', description: 'Relatos de Borges con ideas filosóficas, enigmas y una imaginación literaria que desafía la realidad.' },
];

async function requestJson(url, options = {}) {
  const { headers: requestHeaders = {}, ...restOptions } = options;

  const response = await fetch(url, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(requestHeaders || {}),
    },
  });

  const rawText = await response.text();
  let payload = null;

  try {
    payload = rawText ? JSON.parse(rawText) : null;
  } catch {
    payload = rawText;
  }

  if (!response.ok) {
    const message = payload && typeof payload === 'object' && 'message' in payload ? payload.message : rawText || 'Error inesperado';
    throw new Error(`${response.status} ${message}`);
  }

  return payload;
}

async function main() {
  const loginUrl = `${apiBaseUrl.replace(/\/$/, '')}/auth/login`;
  const booksUrl = `${apiBaseUrl.replace(/\/$/, '')}/books`;

  console.log('Iniciando sesión como administrador...');
  const loginResult = await requestJson(loginUrl, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const token = loginResult?.token;
  if (!token) {
    throw new Error('La API no devolvió un token válido. Revisá el usuario y la contraseña del administrador.');
  }

  console.log(`Se encontraron ${booksToCreate.length} libros para crear.`);

  for (const book of booksToCreate) {
    const created = await requestJson(booksUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(book),
    });

    console.log(`✔ Creado: ${created.title ?? book.title} (id ${created.id ?? 'N/D'})`);
  }

  console.log('\nListo. Podés abrir la página principal y ver los libros creados.');
}

main().catch((error) => {
  console.error('\nNo se pudieron crear los libros.');
  console.error(error.message);
  process.exitCode = 1;
});
