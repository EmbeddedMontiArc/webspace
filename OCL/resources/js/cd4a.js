async function execute() {
    const ide = await IDE;
    const filesystem = ide.filesystem;
    const fileURI = ide.fileURI;
    const editorManager = ide.editorManager;

    const url = new URL(window.location.href);
    const cd4aText = url.searchParams.get("cd");

    const $textarea = $("#cd");
    const PATH = "/OCLFiddle/example/cd/AuctionCD.cd";
    const URI = fileURI.create(PATH);

    if(cd4aText) {
        $textarea.text(cd4aText);
        await filesystem.setContent(URI, cd4aText);
    } else {
        const exists = await filesystem.exists(URI);
        const value = $textarea.val();

        if(exists) {
            await editorManager.open(URI, { widgetOptions: { area: "main", mode: "tab-after" }});
        } else {
            await filesystem.createFile(URI, { content: value });
            await editorManager.open(URI, { widgetOptions: { area: "main", mode: "tab-after" }});
        }
    }

    $("#button-reset-cd").on("click", async () => {
        const value = $textarea.val();

        return filesystem.setContent({ uri: URI }, value);
    });
}

execute().catch(error => console.error(error));