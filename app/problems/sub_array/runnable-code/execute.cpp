#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
#include <map>
#include <unordered_map>

##USER_CODE_HERE##

int main() {
    int k;
    int size;

    // Input target sum and array size
    std::cin >> k;
    std::cin >> size;

    std::vector<int> arr(size); // Resize the vector to hold `size` elements

    // Input the array elements
    for (int i = 0; i < size; i++) {
        std::cin >> arr[i];
    }

    // Call the subArray function and print the result
    int output = subArray(arr, k);
    std::cout << output << std::endl;

    return 0;
}