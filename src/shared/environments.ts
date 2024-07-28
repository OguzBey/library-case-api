import { container } from 'tsyringe';

export const registerEnvironments = function () {
  container.register('DB_FULL_HOST', { useValue: process.env.DB_FULL_HOST });
  container.register('DB_NAME', { useValue: process.env.DB_NAME });
  container.register('RUN_MODE', { useValue: process.env.RUN_MODE });
  container.register('DB_USER', { useValue: process.env.DB_USER });
  container.register('DB_PASSWORD', { useValue: process.env.DB_PASSWORD });
};
