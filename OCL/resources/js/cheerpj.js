$(document).ready(function() {
    var CD_PATH = "/example/cd/AuctionCD.cd";
    var OCL_PATH = "/example/ocl/Demo.ocl";

    var $buttonExecute = $("#button-execute");

  function rawStringToBuffer( str ) {
    var idx, len = str.length, arr = new Array( len );
    for ( idx = 0 ; idx < len ; ++idx ) {
        arr[ idx ] = str.charCodeAt(idx) & 0xFF;
    }
    // You may create an ArrayBuffer from a standard array (of values) as follows:
    return new Uint8Array( arr ).buffer;
   }

    function onThen() {
        $buttonExecute.removeClass("disabled");
        $("#console").scrollTop(10000000000);
    }

    function onOCLReadFile(error, oclString) {
        function onCD4AReadFile(error, cdString) {
            if(error) console.error("An error occurred while reading the CD4A file!");
            else {
                var cdDef = document.getElementById("cd-default").value;
				cheerpjRunMain("WriteFileContent", "/app/webspace/OCL/ocljar/ocl.jar", 
				               "example/cd/DefaultTypes.cd", cdDef).then(
				  function(res) {
					  cheerpjRunMain("WriteFileContent", "/app/webspace/OCL/ocljar/ocl.jar", 
				               "example/cd/AuctionCD.cd", cdString).then(
						  function(res) {
							  cheerpjRunMain("WriteFileContent", "/app/webspace/OCL/ocljar/ocl.jar", 
				                 "example/ocl/Demo.ocl", oclString).then(
								 function(res) {
									 
								   cheerpjRunMain("ocl.cli.OCLCDTool", 
								      "/app/webspace/OCL/ocljar/ocl.jar", "-path", "", "-ocl", "example.ocl.Demo", "-preloadCD").then(onThen);
								 }
							  );
						  }
					   );
				  }
				);
            }
        }

        if(error) console.error("An error occurred while reading the OCL file!");
        else CD4APort.readFile(CD_PATH, onCD4AReadFile);
    }

    function onClick(event) {
        if(!$buttonExecute.hasClass("disabled")) {
            $buttonExecute.addClass("disabled");
            OCLPort.readFile(OCL_PATH, onOCLReadFile);
        }
    }

    // init cheerpj
    cheerpjInit();
    $buttonExecute.on("click", onClick);
});
