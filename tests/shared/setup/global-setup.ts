import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { startDocker } from './docker-manager';

const execFileAsync = promisify(execFile);

const runMigrations = async () => {
  const npmExecutable = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  process.env.MAIN_DATABASE_URL =
    'postgresql://devobank:devobank@localhost:5442/devobank-main';
  process.env.READ_DATABASE_URL =
    'postgresql://devobank:devobank@localhost:5443/devobank-read';
  process.env.MIKRO_ORM_ALLOW_GLOBAL_CONTEXT = '1';

  await execFileAsync(npmExecutable, ['run', 'orm:write:migration:up'], {
    cwd: process.cwd(),
    env: process.env,
  });

  // await execFileAsync(npmExecutable, ['run', 'orm:read:migration:up'], {
  //   cwd: process.cwd(),
  //   env: process.env,
  // });
};

const setup = async () => {
  await startDocker();
  await runMigrations();
};

export default setup;
