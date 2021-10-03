# VSCode Extension - [auto-run-command](https://marketplace.visualstudio.com/items?itemName=gabrielgrinberg.auto-run-command#review-details)
[![Build Status](https://travis-ci.org/GabiGrin/vscode-auto-run-command.svg?branch=master)](https://travis-ci.org/GabiGrin/vscode-auto-run-command)

Run a command when VSCode starts, based on some conditions.
Built to run [Wallaby.js](https://marketplace.visualstudio.com/items?itemName=WallabyJs.wallaby-vscode) automatically on projects that have a config.
I decided to make it a bit more generic to play around with the API (and because developing an extension there is super smooth! Awesome work VSCode guys!)

## Usage
The way this extension works is by reading a list of rules from your settings.
Each rule is evaluated and if the rule's condition is met, a command is ran.

A rule consists of a condition, a command and an optional message. The message will be shown if the condition is met.

You need to open your settings: File -> Preferences -> User Settings, and add a rule. Check below for examples.

ProTip™: Both `command` and `condition` accept arrays. If you pass in multiple conditions, all of them have to be met. If multiple commands are passed, all of them will run.

Note: commands run after a 5s delay to ensure the command was registered. If there's a better way to do that other than delaying, let me know!

## Example Settings

1. Simple -Running wallaby.js when vscode opens on a folder with a config file
   
```json
"auto-run-command.rules": [
    {
      "condition": "hasFile: wallaby.js",
      "command": "wallaby.start",
      "message": "Running wallaby"
    }
  ]
```

1. Running some command (assuming an extension exposed it) when vscode opens on a specific project containing a specific file
   
```json
"auto-run-command.rules": [
    {
      "condition": [
        "hasFile: special-file",
        "isRootFolder: my-coolz-prodgekt"
      ],
      "command": "crazy-ext.do-magic",
      "message": "Super condition met. Running "
    }
  ]
```

1. You can also run a command with arguments by using spaces to separate the arguments:

```json
      "command": "crazy-ext.do-magic arg1 arg2 arg3",
```


## If you find a real usage for this other than wallaby.js I'll be glad to know! Leave a message in the issues part.

## Run Task

1. Run a VS Code Task named task_name (note: task name cannot have a space in it)
   
```json
"auto-run-command.rules": [
    {
      "condition": "always",
      "command": "workbench.action.tasks.runTask task_name",
      "message": "Running my awesome task"
    }
  ]
```

## shellCommand

If you set the `shellCommand` argument to true, then it will run a shell command instead of a VSCode command.

Example:

```json
"auto-run-command.rules": [
  {
    "condition": [
      "hasFile: special-file",
      "isRootFolder: my-coolz-prodgekt"
    ],
    "command": "export COOL_ENV_VARIABLE=cool",
    "message": "Super condition met. Running ",
    "shellCommand": true
  }
]
```

# Supported rules
|      Condition       | Description                                                                                  | Arguments                            | Example                         |
|:--------------------:|----------------------------------------------------------------------------------------------|--------------------------------------|---------------------------------|
|        always        | Is always true                                                                               | none                                 | `always`                        |
|       hasFile        | Will only be true if a file exists in the current folder                                     | file name / glob (did not test glob) | `hasFile: wallaby.js`           |
|      isLanguage      | Will run if the first file opened is using a specific language. Not sure how useful is it :) | language id                          | `isLanguage: typescript`        |
|     isRootFolder     | Will run if the name of the root folder in the current workspace matches the argument        | folder name                          | `isRootFolder: my-cool-project` |
| isRunningInContainer | Will run if the VSCode instance is running in a container                                    | none                                 | `isRunningInContainer`          |


## Release Notes
[here](CHANGELOG.md)


-----------------------------------------------------------------------------------------------------------

## Contributing

- To run locally just open the project and [debug using vscode](https://code.visualstudio.com/docs/extensions/example-hello-world).
- To add more rules check out `src/lib/condition-parser.ts` and `src/lib/condition-checker.ts`. Make sure to add a test on the parser too

PR's are welcomed!

VSCode market icon by: [Vaadin](http://www.flaticon.com/authors/vaadin)

**Enjoy!**
