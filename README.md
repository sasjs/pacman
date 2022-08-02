# Pacman for SAS

Thanks to [Dale Harvey](https://github.com/daleharvey) for this very [permissively licensed](https://github.com/daleharvey/pacman/blob/master/LICENSE) pacman game!

![](src/pacman.png)


The aim of this repo is to demonstrate the ease with which apps can be streamed in SAS Viya, EBI, and SASjs Server.

To build the game, you first need to [install](https://cli.sasjs.io/installation) the SASjs CLI.

Then, update the `defaultTarget` attribute of the `sasjs/sasjsconfig.json` according to whether you are running SASjs `server`, `sas9` EBI, or `viya`.  You should also update the `serverUrl` and `appLoc` attributes of the relevant target, to determine to which server and logical folder you will deploy.

Instructions thereafter:

```bash
npm i
sasjs auth
sasjs cbd
```

You can then click the link at the bottom of the console to open the game!




