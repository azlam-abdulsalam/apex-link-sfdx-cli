/*
 Copyright (c) 2022 Kevin Jones, All rights reserved.
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:
 1. Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.
 3. The name of the author may not be used to endorse or promote products
    derived from this software without specific prior written permission.
 */

import * as fs from 'fs';
import * as path from 'path';

export class StubFS {
  private storePath: string;

  newFiles: Map<string, string> = new Map();

  constructor(workspacePath: string) {
    this.storePath = this.createStore(workspacePath);
  }

  public newFile(path: string, contents: string): void {
    this.newFiles.set(path, contents);
  }

  public sync(): void {
    this.newFiles.forEach((contents, filePath) => {
      const targetPath = path.join(this.storePath, filePath);
      const directory = path.dirname(targetPath);
      fs.mkdirSync(directory, { recursive: true });
      fs.writeFileSync(targetPath, contents);
    });
    this.newFiles.clear();
  }

  private createStore(workspacePath: string): string {
    const storeDirectory = path.join(workspacePath, '.apexlink', 'gulp');
    fs.mkdirSync(storeDirectory, { recursive: true });
    return storeDirectory;
  }
}
