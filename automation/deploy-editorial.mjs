// Run from the user's already-authenticated computer. Never asks for secrets in chat.
import {spawnSync} from 'node:child_process';
import {readFileSync, writeFileSync, unlinkSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const cli = join(root, 'node_modules/wrangler/bin/wrangler.js');
const schedulerPath = join(root, 'automation/bosque-scheduler/wrangler.jsonc');
const scheduler = JSON.parse(readFileSync(schedulerPath, 'utf8'));
const main = JSON.parse(readFileSync(join(root, 'wrangler.jsonc'), 'utf8'));
const env = {...process.env, CLOUDFLARE_ACCOUNT_ID: scheduler.account_id};
const temporaryConfig = join(root, 'wrangler.editorial.local.json');

function wrangler(args, json = false) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: root, env, encoding: 'utf8', stdio: json ? ['inherit', 'pipe', 'inherit'] : 'inherit',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Wrangler no pudo completar: ${args.slice(0, 2).join(' ')}. Si falta acceso, inicia sesión con Wrangler en esta computadora y vuelve a ejecutar.`);
  return json ? JSON.parse(result.stdout) : undefined;
}

async function mainDeployment() {
  wrangler(['whoami', '--json'], true);
  const deployments = wrangler(['deployments', 'list', '--name', main.name, '--json'], true);
  const current = [...deployments].sort((a, b) => a.created_on.localeCompare(b.created_on)).at(-1);
  if (current?.versions?.length !== 1 || current.versions[0].percentage !== 100) {
    throw new Error('La producción usa varias versiones o no se pudo identificar. No se modificó Cloudflare.');
  }
  const versionId = current.versions[0].version_id;
  const version = wrangler(['versions', 'view', versionId, '--name', main.name, '--json'], true);
  const bindings = version.resources.bindings;
  const unsupported = bindings.filter(b => !['plain_text', 'json', 'secret_text', 'kv_namespace', 'd1'].includes(b.type));
  if (unsupported.length) throw new Error('Hay recursos adicionales en producción. Se detiene para conservarlos.');
  const kv = bindings.find(b => b.type === 'kv_namespace' && b.name === 'DEDUP');
  const database = bindings.find(b => b.type === 'd1' && b.name === 'WHATSAPP_DB');
  if (!kv?.namespace_id || database?.id !== main.d1_databases[0].database_id) {
    throw new Error('No coinciden los recursos de producción. No se modificó Cloudflare.');
  }
  if (bindings.some(b => ['kv_namespace', 'd1'].includes(b.type) && !['DEDUP', 'WHATSAPP_DB'].includes(b.name))) {
    throw new Error('Hay bindings adicionales. No se modificó Cloudflare.');
  }
  const plainVars = Object.fromEntries(bindings.filter(b => ['plain_text', 'json'].includes(b.type))
    .map(b => [b.name, b.type === 'json' ? b.json : b.text]));
  main.account_id = scheduler.account_id;
  main.kv_namespaces = [{binding: 'DEDUP', id: kv.namespace_id}];
  main.vars = {...plainVars, ...main.vars};
  writeFileSync(temporaryConfig, JSON.stringify(main, null, 2), {mode: 0o600});
  console.log('Versión anterior de Instagram:', versionId);
  console.log('Conservando el KV y la base de datos actuales.');
  wrangler(['deploy', '--config', schedulerPath]);
  wrangler(['deploy', '--config', temporaryConfig, '--keep-vars']);
  const paused = await fetch('https://campeach-bosque-scheduler.nomanychat.workers.dev/health').then(r => {
    if (!r.ok) throw new Error('No se pudo comprobar el scheduler.');
    return r.json();
  });
  const healthy = await fetch('https://campeach-instagram.nomanychat.workers.dev/health').then(r => {
    if (!r.ok) throw new Error('No se pudo comprobar Instagram.');
    return r.json();
  });
  if (paused.enabled !== false || healthy.editorialVersion !== '2026-10-23') {
    throw new Error('El despliegue requiere revisión; la comprobación final no coincide.');
  }
  console.log('CLOUDFLARE_ACTUALIZADO: promoción repetitiva pausada y publicador editorial verificado.');
  console.log('Vuelve al chat para terminar de activar el calendario en GitHub.');
}

try {
  await mainDeployment();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  try { unlinkSync(temporaryConfig); } catch {}
}
