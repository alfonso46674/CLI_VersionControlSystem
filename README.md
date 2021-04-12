## CLI for a version control system in Node.js

Command line interface for a version control system. This small cli can perform basic VSC commands such as initialize a repository, save snapshots for current files, create different changes, and revert changes.



## Installation
```sh
npm install -g .
```

## Commands

### Initialize repository
```sh
jpar init
```
### Make snapshot of current working directory
```sh
jpar snapshot create -m <message>
```
### Revert to a previous snapshot 
```sh
jpar snapshot revert -n <Snapshot hash>
```
### Show snapshot history
```sh
jpar log
```

## Uninstall
```sh
npm uninstall -g JPAR
```



