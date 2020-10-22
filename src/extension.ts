// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

function insertText(text: string) {
	const editor = vscode.window.activeTextEditor

	if (!editor) {
		vscode.window.showErrorMessage("Can't insert log if no document is open");
		return;
	}

	const { selection } = editor;
	const range = new vscode.Range(selection.start, selection.end);

	editor.edit(editBuilder => {
		editBuilder.replace(range, text);
	})
}

function getAllLogStatements(document: vscode.TextDocument, documentText: string): vscode.Range[] {
	let logStatements = [];

	const logRegex = /log.(Print|Printf|Println)\((.*)\)/g;
	let match;
	while (match = logRegex.exec(documentText)) {
		let matchRange = new vscode.Range(document.positionAt(match.index), document.positionAt(match.index + match[0].length));
		if (!matchRange.isEmpty) {
			logStatements.push(matchRange);
		}
	}

	return logStatements
}

async function deleteFoundLogStatements(workspaceEdit: vscode.WorkspaceEdit, docUri: vscode.Uri, logs: vscode.Range[]) {
	logs.forEach(log => {
		workspaceEdit.delete(docUri, log);
	})

	await vscode.workspace.applyEdit(workspaceEdit);
	vscode.window.showInformationMessage(`${logs.length} logs deleted`)
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('go-log-utils is now active!');

	const insertLogStatement = vscode.commands.registerCommand('go-log-utils.insertLogStatement', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) { return; }

		const { selection } = editor;
		const text = editor.document.getText(selection);

		if (text) {
			await vscode.commands.executeCommand('editor.action.insertLineAfter');
			const vars = text.split(",").map(x => x.trim());
			const formats = new Array(vars.length).fill("%v");
			const logToInsert = `log.Printf("${text}: ${formats.join(", ")}\\n", ${vars.join(", ")})`;
			insertText(logToInsert);
			return;
		}
		insertText('log.Println()')
	})
	context.subscriptions.push(insertLogStatement)

	const deleteAllLogStatements = vscode.commands.registerCommand('go-log-utils.deleteAllLogStatements', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) { return; }

		const { document } = editor;
		const documentText = document.getText();

		const logStatements = getAllLogStatements(document, documentText);

		let workspaceEdit = new vscode.WorkspaceEdit();

		deleteFoundLogStatements(workspaceEdit, document.uri, logStatements);
	})
	context.subscriptions.push(deleteAllLogStatements)
}

// this method is called when your extension is deactivated
export function deactivate() { }
