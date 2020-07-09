let MappingsProcess = require('../obj/src/container/MappingsProcess').MappingsProcess;

try {
    new MappingsProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
