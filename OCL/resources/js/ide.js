const IDE = (function() {
    function getAPI(id) {
        return new Promise(resolve => {
            $(document).ready(() => {
                const iframe = document.getElementById(id);
                let loaded = false;

                function onLoad() {
                    if (loaded) {
                        const timer = window.setInterval(() => {
                            const ide = iframe.contentWindow;
                            if (ide.hasOwnProperty("api")) {
                                window.clearInterval(timer);
                                resolve(ide.api);
                                iframe.removeEventListener("load", onLoad);
                            }
                        }, 500);
                    } else {
                        loaded = true;
                    }
                }

                iframe.addEventListener("load", onLoad);
            });
        });
    }

    return getAPI("ide").then(api => {
        $("#loader-container").remove();
        return api;
    });
}());