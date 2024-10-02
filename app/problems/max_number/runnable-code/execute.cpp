#include <iostream>
#include <cmath>
#include <string>
#include <algorithm>
#include <vector>

using namespace std;

##USER_CODE_HERE##

int main() {
    int size, num;
    cin >> size;
    cin >> num;
    vector<int> arr(size);
    for (int i = 0; i < size; i++) {
        cin >> arr[i];
    }
    cout << max_number(arr) << endl;
    return 0;
}