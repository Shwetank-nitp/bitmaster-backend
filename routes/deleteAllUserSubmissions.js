use("bitmaster");

testcases = db.getCollection("testcases");
submissions = db.getCollection("submissions");

submissions.deleteMany({});
testcases.deleteMany({});
