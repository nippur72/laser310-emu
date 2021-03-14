var modConcat = require("module-concat");

function concat(source, dest) {
    modConcat(source, dest, function(err, stats) {
        if(err) throw err;
        console.log(stats.files.length + " were combined into " + dest);
    });
}

concat("./src/main.js", "./dist/bundle.js");


