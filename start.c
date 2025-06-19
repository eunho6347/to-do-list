#include <stdio.h>

int main(void)
{
    int num, pn, a, tf, cnt;
    cnt=0;
    printf("2 이상의 정수를 입력하세요: ");
    scanf("%d", &num);
    for(pn=2; pn<=num;pn++ ){
        tf=1;
        for(a=2; a<pn; a++){
            if(pn%a==0){
            tf=0;
            break; 
            }
        }
        if(tf==1){
            printf("%5d", pn);
            cnt++;
            if(cnt%5==0){
                printf("\n");
            }
        }
    }

    return 0;
}

