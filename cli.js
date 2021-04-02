#!/usr/bin/env node

var path       = require('path');
var requireAll = require('require-all');
var commands   = requireAll(path.join(__dirname, 'commands'));
let package = require('./package.json')

var yargs = require('yargs');

function loadCommands(yargs, commands, level, parent) {
  level  = level || 1;
  parent = parent ? ' ' + parent : '';

  yargs
    .demand(level)
    .usage('Usage: ' + package.CLI_command + parent + ' <command> [options]');


    Object.keys(commands).forEach(function (commandName) {
        var isFolder, subCommands;
    
        commandName = commandName.split('_');
        isFolder  = commandName[1];
        commandName = commandName[0];
    
        if(isFolder) { return; }
    
        subCommands = commands[commandName + '_commands'];
        //si no hay subcommandos
        if(!subCommands) {
          yargs = yargs.command(
            commandName,
            commands[commandName].description,
            commands[commandName].command
          );
        } else { // si hay subcomandos
          yargs = yargs.command(
            commandName,
            commands[commandName].description,
            function(yargs) {
              loadCommands(yargs, subCommands, level + 1, commandName);
            }
          )
        }
      });
    
      yargs.help('help');
}

loadCommands(yargs, commands);
yargs.scriptName("JPAR").argv;