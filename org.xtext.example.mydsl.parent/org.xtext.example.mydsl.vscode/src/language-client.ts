'use strict';

import * as net from 'net';
import * as os from 'os';
import * as path from 'path';
import * as process from 'process';
import { ExtensionContext, workspace } from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  StreamInfo,
  ServerOptions,
  Trace,
} from 'vscode-languageclient';

const languageClientId = 'Example Language Server';

function createLanguageClientOptions(): LanguageClientOptions {
    return {
      documentSelector: [
        { scheme: 'file', language: 'house' },
        { scheme: 'file', language: 'person' },
      ],
      synchronize: {
        fileEvents: [
          workspace.createFileSystemWatcher('**/*.{house,person}')
        ],
      },
    };
  }

  export function createLanguageClientWithRunningServer(
    port: number = 5007
  ): LanguageClient {
    const connectToLanguageServer = (): Promise<StreamInfo> => {
      const socket = net.connect({ port });
      const stream: StreamInfo = {
        writer: socket,
        reader: socket,
      };
      return Promise.resolve(stream);
    };
  
    const languageClient = new LanguageClient(
      languageClientId,
      connectToLanguageServer,
      createLanguageClientOptions()
    );
    languageClient.trace = Trace.Verbose;
  
    return languageClient;
  }

  export function createLanguageClientAndLaunchServer(
    context: ExtensionContext
  ): LanguageClient {
    // TODO check for JAVA installed + version (see vscode-java/src/requirements.ts)
  
    const startScript = `org.xtext.example.mydsl.ide${
      os.platform() === 'win32' ? '.bat' : ''
    }`;
    const startScriptPath = context.asAbsolutePath(
      path.join('language-server', 'bin', startScript)
    );
  
    const serverOptions: ServerOptions = {
      run: { command: startScriptPath },
      debug: {
        command: startScriptPath,
        env: {
          // propagate current environemnt: would be default for `child_process.spawn()` used by `LanguageClient`
          ...process.env,
          // enable Java remote debugging: $JAVA_OPTS is expected by gradle created `startScript`
          JAVA_OPTS:
            '-Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=8000,suspend=n,quiet=y',
        },
      },
    };
    const languageClient = new LanguageClient(
        languageClientId,
        serverOptions,
        createLanguageClientOptions()
      );
      // TODO enable trace for `debug` option?
      languageClient.trace = Trace.Off;
      return languageClient;
    }

    export function createLanguageClientForEnv(
      context: ExtensionContext
    ): LanguageClient {
      const portOfRunningServer = Number.parseInt(
        process.env.RHMI_LANGUAGE_SERVER_RUNNING_ON_PORT!,
        10
      );
      return portOfRunningServer > 0
        ? createLanguageClientWithRunningServer(portOfRunningServer)
        : createLanguageClientAndLaunchServer(context);
    }