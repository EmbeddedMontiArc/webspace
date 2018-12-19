async function execute() {
    const CD_PATH = "/OCLFiddle/example/cd/AuctionCD.cd";
    const OCL_PATH = "/OCLFiddle/example/ocl/Demo.ocl";
    const CD_DEFAULT_PATH = "/OCLFiddle/example/cd/DefaultTypes.cd";

    const ide = await IDE;
    const filesystem = ide.filesystem;
    const fileURI = ide.fileURI;

    const CD_URI = fileURI.create(CD_PATH);
    const OCL_URI = fileURI.create(OCL_PATH);
    const CD_DEFAULT_URI = fileURI.create(CD_DEFAULT_PATH);

    var $buttonExecute = $("#button-execute");

    function transferToCheerpJ(path, content) {
        const cheerpJPath = path.replace("/OCLFiddle/", '');

        return cheerpjRunMain("WriteFileContent", "/app/webspace/OCL/ocljar/ocl.jar", cheerpJPath, content);
    }

    async function onClick() {
        if(!$buttonExecute.hasClass("disabled")) {
            $buttonExecute.addClass("disabled");

            const oclContents = await filesystem.resolveContent(OCL_URI);
            const cdContents = await filesystem.resolveContent(CD_URI);
            const cdDefaultContents = await filesystem.resolveContent(CD_DEFAULT_URI);

            await transferToCheerpJ(OCL_PATH, oclContents.content);
            await transferToCheerpJ(CD_PATH, cdContents.content);
            await transferToCheerpJ(CD_DEFAULT_PATH, cdDefaultContents.content);

            await cheerpjRunMain("ocl.cli.OCLCDTool",
                "/app/webspace/OCL/ocljar/ocl.jar", "-path", "", "-ocl", "example.ocl.Demo", "-preloadCD");

            $buttonExecute.removeClass("disabled");
            $("#console").scrollTop(10000000000);
        }
    }

    // init cheerpj
    await cheerpjInit();
    $buttonExecute.on("click", onClick);
}

execute().catch(error => console.error(error));