# Pacman for SAS

Thanks to [Dale Harvey](https://github.com/daleharvey) for this very [permissively licensed](https://github.com/daleharvey/pacman/blob/master/LICENSE) pacman game!

![](src/pacman.png)

The aim of this repo is to demonstrate the ease with which apps can be streamed in SAS Viya, EBI, and SASjs Server.

Play it with no SAS server at all: https://sasjs.github.io/pacman/ - the mock site, built from the same target as the streamed app.

## Quick Start on Viya

Just run the following in SAS Studio, and open the link at the bottom of the log:

```sas
%let apploc=/Users/&sysuserid/My Folder/apps/pacman;
filename pac url "https://github.com/sasjs/pacman/releases/latest/download/viya.sas";
%inc pac;
```

This will deploy the streaming version of the app (compiled using `sasjs cb`)

## Deployment

If you just want to deploy the game in your SAS environment, in all cases you need to download the relevant asset from the [releases](https://github.com/sasjs/pacman/releases) page.

* SAS 9 - Open `sas9.sas` in Enterprise Guide or Studio.  Modify line 2 with your preferred appLoc.  Execute and open the link at the end of the log.
* Viya - Open `viya.sas` in SAS Studio. Execute and open the link at the end of the log.
* SASjs Server - import `server.json.zip` on the AppStream page, or `sasjs deploy -t server`. The pack is a streamed app: its files land at the target `appLoc` (`/Public/app/pacman` by default) and the deploy publishes it, so it opens at `/app/<id>/`.

## Build

If you would like to build the app from source, you first need to [install](https://cli.sasjs.io/installation) the SASjs CLI.

Then, update the `defaultTarget` attribute of the `sasjs/sasjsconfig.json` according to whether you are running SASjs `server`, `sas9` EBI, or `viya`.  You should also update the `serverUrl` and `appLoc` attributes of the relevant target, to determine to which server and logical folder you will deploy.

Instructions thereafter:

```bash
npm ci
sasjs auth
sasjs cbd
```

You can then click the link at the bottom of the console to launch!

The `server` target also builds a static mock site (`streamConfig.mockWeb`), so
the game can be played with no SAS server at all:

```bash
npx sasjs cb -t server
npx http-server ./sasjsbuild/mock -p 3001
```

The mock site serves `src/` at its root and seeds the streamed deployment onto
its in-browser drive at `appLoc`, which is where an app reads its files from.

## Demo

This video demonstrates a deployment onto SAS Viya.

[![Pacman on SAS](https://img.youtube.com/vi/uSZw2d_NOHg/0.jpg)](http://www.youtube.com/watch?v=uSZw2d_NOHg)


If you'd like to publish an app with SASjs, we're happy to help - contact us [here](https://sasapps.io/contact).
