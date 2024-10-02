#include <iostream>
#include <cmath>
#include <string>
#include <algorithm>
#include <vector>

using namespace std;

##USER_CODE_HERE##

int main() {
    int size, k;
    cin >> size;
    cin >> k;
    vector<int> arr(size);
    for (int i = 0; i < size; i++) {
        cin >> arr[i];
    }
    vector<int> ans = two_sum(arr, k);
    for(auto& i : ans) {
        cout << i << " ";
    }
    return 0;
}