async function execute() {
    const ide = await IDE;
    const filesystem = ide.filesystem;
    const fileURI = ide.fileURI;
    const editorManager = ide.editorManager;

    const $textarea = $("#cd-default");
    const PATH = "/OCLFiddle/example/cd/DefaultTypes.cd";
    const URI = fileURI.create(PATH);

    const exists = await filesystem.exists(URI);
    const value = $textarea.val();

    if(exists) {
        await editorManager.open(URI, { mode: "open", widgetOptions: { area: "main", mode: "tab-before" }});
    } else {
        await filesystem.createFile(URI, { content: value });
        await editorManager.open(URI, { mode: "open", widgetOptions: { area: "main", mode: "tab-before" }});
    }

    $("#button-reset-cd").on("click", async () => {
        const value = $textarea.val();

        return filesystem.setContent({ uri: URI }, value);
    });
}

execute().catch(error => console.error(error));