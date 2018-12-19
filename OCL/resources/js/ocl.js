async function execute() {
    const ide = await IDE;
    const filesystem = ide.filesystem;
    const fileURI = ide.fileURI;
    const editorManager = ide.editorManager;

    const url = new URL(window.location.href);
    const oclText = url.searchParams.get("ocl");

    const $textarea = $("#ocl");
    const PATH = "/OCLFiddle/example/ocl/Demo.ocl";
    const URI = fileURI.create(PATH);

    if(oclText) {
        $textarea.text(oclText);
        await filesystem.setContent(URI, oclText);
    } else {
        const exists = await filesystem.exists(URI);
        const value = $textarea.val();

        if(exists) {
            await editorManager.open(URI, { widgetOptions: { area: "main", mode: "split-right" }});
        } else {
            await filesystem.createFile(URI, { content: value });
            await editorManager.open(URI, { widgetOptions: { area: "main", mode: "split-right" }});
        }
    }

    $("#button-reset-ocl").on("click", async () => {
        const value = $textarea.val();

        return filesystem.setContent({ uri: URI }, value);
    });
}

execute().catch(error => console.error(error));