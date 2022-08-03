# Pacman for SAS

Thanks to [Dale Harvey](https://github.com/daleharvey) for this very [permissively licensed](https://github.com/daleharvey/pacman/blob/master/LICENSE) pacman game!

![](src/pacman.png)

The aim of this repo is to demonstrate the ease with which apps can be streamed in SAS Viya, EBI, and SASjs Server.

## Deployment

If you just want to deploy the game in your SAS environment, in all cases you need to download the relevant asset from the [releases](https://github.com/sasjs/pacman/releases) page.

* SAS 9 - Open `sas9.sas` in Enterprise Guide or Studio.  Modify line 2 with your preferred appLoc.  Execute and open the link at the end of the log.
* Viya - Open `viya.sas` in SAS Studio. Execute and open the link at the end of the log.
* SASjs Server - just import the `server.json.zip` file to AppStream

## Build

If you would like to build the app from source, you first need to [install](https://cli.sasjs.io/installation) the SASjs CLI.

Then, update the `defaultTarget` attribute of the `sasjs/sasjsconfig.json` according to whether you are running SASjs `server`, `sas9` EBI, or `viya`.  You should also update the `serverUrl` and `appLoc` attributes of the relevant target, to determine to which server and logical folder you will deploy.

Instructions thereafter:

```bash
npm i
sasjs auth
sasjs cbd
```

You can then click the link at the bottom of the console to launch!

## Demo

This video demonstrates a deployment onto SAS Viya.

<video src="https://github.com/sasjs/pacman/blob/main/pacman.mp4?raw=true"></video>


