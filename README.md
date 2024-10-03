# BitMaster Backend Repository

Welcome to the backend repository of BitMaster, an online platform for coding and DSA practice. This guide will walk you through the process of contributing new coding questions to the platform.

## How to Contribute a New Question

To add a new question to the repository, follow these steps:

### 1. Create a Folder for the Question

1. Navigate to the `app/problem/` directory.
2. Create a new folder named after the **slug** of the question (e.g., `two_sum`). This will be your question's unique identifier.

### 2. Inside the Slug Folder, Create the Following Structure:

#### a. `runnable-code/` folder
This folder should contain the code that can be executed for the problem. The structure depends on the programming language used for the solution.

#### b. `testcases/` folder
Inside the `testcases/` folder, create:
- `input/` folder: This should include all the input files required to test the problem.
- `output/` folder: This should contain corresponding output files for each input.

Make sure that each input file has a corresponding output file. The file names should match (e.g., `input1.txt`, `output1.txt`).

### 3. Create `code.md` and `problem.md`

- **`code.md`:** This file should contain the structure of the code. It should include the function signature, the expected input and output format, and any constraints.
  
- **`problem.md`:** This file should describe the problem statement clearly. Include the problem description, sample inputs and outputs, constraints, and any additional explanations.

### 4. Ensure Test Case Credibility and Integrity

Before submitting a pull request, please ensure:
- Test cases are valid, diverse, and cover edge cases.
- Inputs and outputs are accurate and credible.
- The test case folder should include both simple and complex test cases to thoroughly evaluate the solution.

### 5. Sample Input and Output Files

Make sure the input and output files in the `testcases/inputs and testcases/outputs` folder follow this format:
for size, num, arr

#### Sample Input (0.txt)
```
2
4
5
-1
```
size = 2
num = 4 
arr = [5, -1] 

#### Sample Output (0.txt)
```
9
```

### 6. Submit a Pull Request (PR)

Once everything is in place, you can submit a PR. Our team will review your submission, focusing on the accuracy of the test cases and the clarity of the problem and solution structure.

Thank you for contributing to BitMaster! Your efforts help make coding and DSA practice better for everyone.
