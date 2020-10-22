# go-log-utils README

Easily insert and remove log.(Printf|Println|Print) in go files

Credit to [javascript-console-utils](https://github.com/whtouche/vscode-js-console-utils)

## Features

In any `.go` file,

With selection:

* Highlight a variable, or multiple variables (works best if they are on the same line)
* Press Cmd+Shift+L (Mac) or Ctrl+Shift+L (Windows)
* The output on a new line will be: `log.Printf("variables: %v...", variables...)`

Without selection:

* Press Cmd+Shift+L (Mac) or Ctrl+Shift+L (Windows)
* The output on a new line will be: `log.Printf()`

To remove logs:

* Press Cmd+Shift+D (Mac) or Ctrl+Shift+D (Windows)
* This will delete all `log.(Printf|Println|Print)` statements in the current active document

## TODO

* Configuration option for deleting other log statements, such as `log.Fatal`, `log.Panic` etc. 

## Contributing

Please contribute!

## License

MIT © 2020 [gpng](https://github.com/gpng)
