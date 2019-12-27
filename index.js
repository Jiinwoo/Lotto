const puppeteer = require('puppeteer');
const fs = require('fs');
const cookiesPath = "cookies.txt";

(async () => {
    const browser = await puppeteer.launch({headless : false,slowMo: 250});
  const page = await browser.newPage();
    const previousSession = fs.existsSync(cookiesPath)
    if (previousSession) {
      const content = fs.readFileSync(cookiesPath);
      const cookiesArr = JSON.parse(content);
      if (cookiesArr.length !== 0) {
        for (let cookie of cookiesArr) {
          await page.setCookie(cookie)
        }
        console.log('Session has been loaded in the browser')
      }
    }  
  
    
  const cookies = [{
    'name': 'JSESSIONID',
    'value': '0AcgU031axuF1ChFW1mN3es42HuxuUKkPoOa79fL56qZd47B4zxmcDYI2IUutADd.cG9ydGFsX2RvbWFpbi9wZDM='
  },{
    'name': 'UID',
    'value': 'wlsdn1962'
  },{
    'name': 'WMONID',
    'value': 'Po4Sd1xhMNx'
  },{
    'name': 'WMONID',
    'value': 'V-YgYU8aB_V'
  },{
    'name': 'pop13798',
    'value': 'done'
  }];
  await page.goto('https://dhlottery.co.kr/gameResult.do?method=statByNumber');
  await page.waitForSelector('#printTarget');
  
 let result = []
     result = await page.evaluate(() => {
         const a = [];
         let temp;
         for(let i = 0 ; i < 45 ; i++){
            temp = document.querySelector(`#printTarget > tbody > tr:nth-child(${i+1}) > td:nth-child(3)`).textContent;
            a.push(temp);
         }
        return a;
     });
     const numberArray = result.map((v)=>parseInt(v));
     
     const accArray = numberArray.reduce((acc,cur,index)=>{
        if(index===0){
            acc.push(cur);
            return acc;
        }
        acc.push(cur+acc[index-1]); 
        return acc
     },[])
     console.log(accArray);
    let lotto = []
    while(lotto.length < 6){
       const randomeValue = Math.random() * accArray[44]
       console.log(randomeValue)
        const temp = accArray.findIndex(element => element >randomeValue);
        if(!lotto.find(element=>element === temp + 1)){
            lotto.push(temp + 1)
        }
    }
   console.log('로또번호 ' ,lotto)
   await page.goto('https://www.dhlottery.co.kr/common.do?method=main')
   // Save Session Cookies
//    await page.waitFor(10000);
//     // Write Cookies
//     const cookiesObject = await page.cookies()
//     fs.writeFileSync(cookiesPath, JSON.stringify(cookiesObject));
//     console.log('Session has been saved to ' + cookiesPath);
})();