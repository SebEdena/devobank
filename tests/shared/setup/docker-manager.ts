import * as path from 'node:path';
import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
} from 'testcontainers';
import 'dotenv/config';

let instance: StartedDockerComposeEnvironment | null = null;

export const startDocker = async () => {
  const composeFolder = path.resolve(__dirname);
  const composeFile = 'docker-compose.yaml';

  instance = await new DockerComposeEnvironment(
    composeFolder,
    composeFile,
  ).up();
};

export const stopDocker = async () => {
  if (!instance) return;

  try {
    await instance.down();
    instance = null;
  } catch (error) {
    console.error('Error during Docker teardown:', error);
  }
};

export const getDockerEnvironment = (): StartedDockerComposeEnvironment => {
  if (!instance) {
    throw new Error('Instance is not available.');
  }
  return instance;
};
