#include <iostream>
using namespace std;


int main() {
    int N, tot = 5000, ans = -1;
    cin >> N;
    for(int x=0; x<N; x++){
        for(int y=0; y<N; y++){
            if(3*x + 5*y == N){
                if(x+y < tot){
                    tot = x+y;
                    ans = tot;
                }
            }
        }
    }
    cout << ans;
    return 0;
}
