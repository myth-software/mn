/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Tree } from '@angular-devkit/schematics';
import { ensure, sortObjectByKeys } from '@mountnotion/utils';

interface PackageJson {
  dependencies: Record<string, string>;
}

/** Adds a package to the package.json in the given host tree. */
export function addPackageToPackageJson(
  host: Tree,
  pkg: string,
  version: string
): Tree {
  if (host.exists('package.json')) {
    const sourceText = ensure(host.read('package.json')).toString('utf-8');
    const json = JSON.parse(sourceText) as PackageJson;

    if (!json.dependencies) {
      json.dependencies = {};
    }

    if (!json.dependencies[pkg]) {
      json.dependencies[pkg] = version;
      json.dependencies = sortObjectByKeys(json.dependencies);
    }

    host.overwrite('package.json', JSON.stringify(json, null, 2));
  }

  return host;
}
