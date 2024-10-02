const { parentPort } = require("node:worker_threads");

async function run() {
  parentPort.on("message", (data) => {
    const payload = {
      source_code: data.code,
      language_id: data.lang,
      expected_output: data.meta.output,
      token: data.meta.token,
      callback_url: process.env.URL + "submit-evauated-testcase",
    };
  });
}
