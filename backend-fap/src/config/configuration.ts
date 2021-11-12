import { readFileSync } from 'fs';
import * as toml from 'toml';
import { join } from 'path';

const TOML_CONFIG_FILENAME = 'config.toml';

export default () => {
  return toml.parse(
    readFileSync(join('..', __dirname, TOML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;
};
