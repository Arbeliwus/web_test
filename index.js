function readfile(path) {//Ajax
    const xhr = new XMLHttpRequest();
    xhr.open('GET',"https://127.0.0.1"+path, true);//連線設定
    xhr.onload=function(){//偵測連線狀態結束
    console.log(path);
    console.log(this.responseText);
    console.log(this.responseText[0]);
    console.log(this.responseText[1]);
    console.log(this.responseText[2]);
    console.log(this.responseText.length);
    };
    xhr.send(); //送出連線
}

